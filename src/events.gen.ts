// Code generated from schemas/*.schema.json by scripts/gen-types.mjs.
// DO NOT EDIT. Run `pnpm gen` to regenerate. The schemas are synced from
// the avflow engine repository (`make sync-sdks` there) — edit them there.

/**
 * Lifecycle / usage events delivered through the avflow events ingest channel (AVFLOW_EVENTS_INGEST_URL), HMAC-signed with X-Avflow-Signature. Generated from the Go definitions in github.com/avflowhq/avflow/pkg/event; do not edit by hand.
 */
export interface LifecycleEvent {
  schema?: 'avflow.events.v1';
  eventId?: string;
  eventTime?: string;
  instance?: Instance;
  appId?: string;
  job?: JobRef;
  component?: ComponentRef;
  event?:
    | 'job.starting'
    | 'job.started'
    | 'job.completed'
    | 'job.failed'
    | 'job.max_duration_reached'
    | 'job.idle_timeout'
    | 'component.error'
    | 'usage.tick'
    | 'instance.heartbeat';
  sequenceNo?: number;
  reason?: string;
  error?: ErrorInfo;
  usage?: UsageBatch;
  heartbeat?: InstanceHeartbeat;
}
export interface Instance {
  id?: string;
  deployment?: string;
  region?: string;
  version?: string;
}
export interface JobRef {
  id?: string;
  name?: string;
}
export interface ComponentRef {
  name?: string;
  role?: string;
  type?: string;
}
export interface ErrorInfo {
  code?: string;
  message?: string;
  timestamp?: string;
}
export interface UsageBatch {
  window?: UsageWindow;
  components?: UsageComponent[];
  jobDurationSec?: number;
}
export interface UsageWindow {
  since?: string;
  until?: string;
  sec?: number;
}
export interface UsageComponent {
  name?: string;
  role?: string;
  type?: string;
  since?: string;
  final?: boolean;
  source?: SourceValues;
  node?: NodeValues;
  sink?: SinkValues;
}
export interface SourceValues {
  videoFrames?: number;
  videoBytes?: number;
  videoMillis?: number;
  videoPixels?: number;
  videoWidth?: number;
  videoHeight?: number;
  videoCodec?: string;
  activeVideoTracks?: number;
  videoFps?: number;
  videoBitrateBps?: number;
  audioFrames?: number;
  audioBytes?: number;
  audioMillis?: number;
  audioCodec?: string;
  activeAudioTracks?: number;
  audioBitrateBps?: number;
}
export interface NodeValues {
  videoFrames?: number;
  videoMillis?: number;
  videoWidth?: number;
  videoHeight?: number;
  videoPixels?: number;
  videoCodec?: string;
  audioFrames?: number;
  audioMillis?: number;
  audioCodec?: string;
  inputCount?: number;
  activeConnectionSeconds?: number;
  asrProcessedMillis?: number;
  asrUtterances?: number;
  asrModel?: string;
  asrProvider?: string;
  asrSpeakers?: {
    [k: string]: ASRSpeakerStats;
  };
  translateInputMillis?: number;
  translateOutputMillis?: number;
  translateProvider?: string;
  translateModel?: string;
  voiceAgentInputMillis?: number;
  voiceAgentOutputMillis?: number;
  voiceAgentProvider?: string;
  voiceAgentModel?: string;
  mixerComposeMsMax?: number;
  mixerComposeMsSum?: number;
}
export interface ASRSpeakerStats {
  speechDurationMs?: number;
  utterances?: number;
}
export interface SinkValues {
  egressBytes?: number;
  videoFrames?: number;
  videoBytes?: number;
  videoMillis?: number;
  videoPixels?: number;
  videoWidth?: number;
  videoHeight?: number;
  videoCodec?: string;
  videoFps?: number;
  videoBitrateBps?: number;
  audioFrames?: number;
  audioBytes?: number;
  audioMillis?: number;
  audioCodec?: string;
  audioBitrateBps?: number;
  sinkOutputCount?: number;
  imageBuckets?: {
    [k: string]: number;
  };
}
export interface InstanceHeartbeat {
  provider?: string;
  active?: boolean;
  instanceId?: string;
  compute?: string;
  endpoint?: string;
}
