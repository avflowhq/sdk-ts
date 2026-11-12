// gen-types.mjs -- generate the SDK's TypeScript types and runtime constants
// from the canonical JSON Schemas committed under schemas/.
//
// Those schemas are synced verbatim from the (private) avflow engine repo by
// `make sync-sdks` there; this repo never rewrites them. CI runs --check so a
// schema sync without regeneration fails the build.
//
// Usage:
//   node scripts/gen-types.mjs            # (re)write the generated files
//   node scripts/gen-types.mjs --check    # exit 1 if they are out of date
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { compile } from "json-schema-to-typescript";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const JOB_SCHEMA = resolve(root, "schemas/job.schema.json");
const EVENTS_SCHEMA = resolve(root, "schemas/events.schema.json");
const TYPES_OUT = resolve(root, "src/types.gen.ts");
const EVENTS_OUT = resolve(root, "src/events.gen.ts");
const CONSTS_OUT = resolve(root, "src/constants.gen.ts");

const BANNER =
  "// Code generated from schemas/*.schema.json by scripts/gen-types.mjs.\n" +
  "// DO NOT EDIT. Run `pnpm gen` to regenerate. The schemas are synced from\n" +
  "// the avflow engine repository (`make sync-sdks` there) — edit them there.";

const STYLE = {
  singleQuote: true,
  trailingComma: "all",
  semi: true,
  tabWidth: 2,
  printWidth: 100,
};

async function loadSchema(path) {
  if (!existsSync(path)) {
    fail(`schema not found: ${path}`);
  }
  return JSON.parse(await readFile(path, "utf-8"));
}

// The canonical schemas root at a bare `$ref: #/$defs/<Root>`, which
// json-schema-to-typescript refuses to resolve. Inline the referenced
// definition at the root (keeping $defs so #/$defs/* refs still resolve) and
// override the title so the root interface keeps its name.
function inlineRoot(schema, rootDef, title) {
  const { $ref: _rootRef, title: _title, ...rest } = schema;
  return { ...rest, ...schema.$defs[rootDef], title };
}

async function build() {
  const job = await loadSchema(JOB_SCHEMA);
  const events = await loadSchema(EVENTS_SCHEMA);

  const types = await compile(inlineRoot(job, "Job", "Job"), "Job", {
    bannerComment: BANNER,
    additionalProperties: false,
    declareExternallyReferenced: true,
    style: STYLE,
  });

  const eventsTypes = await compile(
    inlineRoot(events, "LifecycleEvent", "LifecycleEvent"),
    "LifecycleEvent",
    {
      bannerComment: BANNER,
      additionalProperties: false,
      declareExternallyReferenced: true,
      style: STYLE,
    },
  );

  return { types, eventsTypes, consts: buildConsts(job) };
}

// enumOf resolves a property enum, accepting the pre-union def spelling
// (Source) as a fallback to the current one (SourceBase).
function enumOf(schema, defs, prop) {
  for (const def of defs) {
    const e = schema.$defs?.[def]?.properties?.[prop]?.enum;
    if (Array.isArray(e)) return e;
  }
  fail(`missing enum at $defs.${defs.join("|")}.properties.${prop}`);
}

function numOf(schema, def, prop, key) {
  const v = schema.$defs?.[def]?.properties?.[prop]?.[key];
  if (typeof v !== "number")
    fail(`missing number $defs.${def}.properties.${prop}.${key}`);
  return v;
}

function buildConsts(schema) {
  const sourceTypes = enumOf(schema, ["SourceBase", "Source"], "type");
  const sinkTypes = enumOf(schema, ["SinkBase", "Sink"], "type");
  const nodeTypes = enumOf(schema, ["NodeBase", "Node"], "type");
  const maxSources = numOf(schema, "Job", "sources", "maxItems");
  const maxSinks = numOf(schema, "Job", "sinks", "maxItems");
  const maxName = numOf(schema, "Job", "name", "maxLength");
  const namePattern = schema.$defs?.Job?.properties?.name?.pattern;
  if (typeof namePattern !== "string")
    fail("missing $defs.Job.properties.name.pattern");

  return (
    `${BANNER}\n\n` +
    `export const SOURCE_TYPES = ${JSON.stringify(sourceTypes)} as const;\n` +
    `export const SINK_TYPES = ${JSON.stringify(sinkTypes)} as const;\n` +
    `export const NODE_TYPES = ${JSON.stringify(nodeTypes)} as const;\n\n` +
    `export const MAX_SOURCES = ${maxSources};\n` +
    `export const MAX_SINKS = ${maxSinks};\n` +
    `export const MAX_NAME_LENGTH = ${maxName};\n` +
    `export const NAME_PATTERN = ${JSON.stringify(namePattern)};\n` +
    `export const EVENTS_SCHEMA_VERSION = 'avflow.events.v1';\n`
  );
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const { types, eventsTypes, consts } = await build();
  const outputs = [
    [TYPES_OUT, types],
    [EVENTS_OUT, eventsTypes],
    [CONSTS_OUT, consts],
  ];

  let drift = false;
  for (const [path, content] of outputs) {
    const existing = existsSync(path) ? await readFile(path, "utf-8") : null;
    if (existing === content) continue;
    if (checkOnly) {
      drift = true;
      warn(`${relative(root, path)} is out of date`);
    } else {
      await writeFile(path, content);
      log(`wrote ${relative(root, path)} (${content.length} bytes)`);
    }
  }

  if (checkOnly) {
    if (drift) {
      fail("run 'pnpm gen' to update");
    }
    log("up to date");
  }
}

function log(msg) {
  process.stdout.write(`gen-types: ${msg}\n`);
}

function warn(msg) {
  process.stderr.write(`gen-types: ${msg}\n`);
}

function fail(msg) {
  process.stderr.write(`gen-types: ${msg}\n`);
  process.exit(1);
}

await main();
