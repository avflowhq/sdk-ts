// Code generated from schemas/*.schema.json by scripts/gen-types.mjs.
// DO NOT EDIT. Run `pnpm gen` to regenerate. The schemas are synced from
// the avflow engine repository (`make sync-sdks` there) — edit them there.

export const SOURCE_TYPES = ["axonkit","livekit","jitsi","daily","agora","rtmp_pull","httpflv_pull","hls_pull","whep","web_capture","video_generator","file_pull","srt_pull","rtsp_pull"] as const;
export const SINK_TYPES = ["axonkit","livekit","jitsi","daily","agora","rtmp_push","srt_push","whip","segment","image","websocket"] as const;
export const NODE_TYPES = ["video_mixer","audio_mixer","audio_resample","video_encoder","audio_encoder","asr","translate","voice_agent"] as const;

export const MAX_SOURCES = 5;
export const MAX_SINKS = 3;
export const MAX_NAME_LENGTH = 128;
export const NAME_PATTERN = "^[^\\s/?#]{1,128}$";
export const EVENTS_SCHEMA_VERSION = 'avflow.events.v1';
