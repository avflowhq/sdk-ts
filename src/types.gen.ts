// Code generated from schemas/*.schema.json by scripts/gen-types.mjs.
// DO NOT EDIT. Run `pnpm gen` to regenerate. The schemas are synced from
// the avflow engine repository (`make sync-sdks` there) — edit them there.

export type Source =
  | SourceAxonkit
  | SourceLivekit
  | SourceJitsi
  | SourceDaily
  | SourceAgora
  | SourceRtmpPull
  | SourceHttpflvPull
  | SourceHlsPull
  | SourceWhep
  | SourceWebCapture
  | SourceVideoGenerator
  | SourceFilePull
  | SourceSrtPull
  | SourceRtspPull;
export type SourceAxonkit = SourceBase & {
  type?: 'axonkit';
  config?: AxonkitSourceConfig;
};
export type SourceLivekit = SourceBase & {
  type?: 'livekit';
  config?: LivekitSourceConfig;
};
export type SourceJitsi = SourceBase & {
  type?: 'jitsi';
  config?: JitsiSourceConfig;
};
export type SourceDaily = SourceBase & {
  type?: 'daily';
  config?: DailySourceConfig;
};
export type SourceAgora = SourceBase & {
  type?: 'agora';
  config?: AgoraSourceConfig;
};
export type SourceRtmpPull = SourceBase & {
  type?: 'rtmp_pull';
  config?: URLPullSourceConfig;
};
export type SourceHttpflvPull = SourceBase & {
  type?: 'httpflv_pull';
  config?: URLPullSourceConfig;
};
export type SourceHlsPull = SourceBase & {
  type?: 'hls_pull';
  config?: URLPullSourceConfig;
};
export type SourceWhep = SourceBase & {
  type?: 'whep';
  config?: URLPullSourceConfig;
};
export type SourceWebCapture = SourceBase & {
  type?: 'web_capture';
  config?: WebCaptureSourceConfig;
};
export type SourceVideoGenerator = SourceBase & {
  type?: 'video_generator';
  config?: VideoGeneratorSourceConfig;
};
export type SourceFilePull = SourceBase & {
  type?: 'file_pull';
  config?: URLPullSourceConfig;
};
export type SourceSrtPull = SourceBase & {
  type?: 'srt_pull';
  config?: URLPullSourceConfig;
};
export type SourceRtspPull = SourceBase & {
  type?: 'rtsp_pull';
  config?: URLPullSourceConfig;
};
export type Node =
  | NodeVideoMixer
  | NodeAudioMixer
  | NodeAudioResample
  | NodeVideoEncoder
  | NodeAudioEncoder
  | NodeAsr
  | NodeTranslate
  | NodeVoiceAgent;
export type NodeVideoMixer = NodeBase & {
  type?: 'video_mixer';
  config?: VideoMixerConfig;
};
export type InputRefs = (string | InputRef)[];
export type NodeAudioMixer = NodeBase & {
  type?: 'audio_mixer';
  config?: AudioMixerConfig;
};
export type NodeAudioResample = NodeBase & {
  type?: 'audio_resample';
  config?: AudioResampleConfig;
};
export type NodeVideoEncoder = NodeBase & {
  type?: 'video_encoder';
  config?: VideoEncoderConfig;
};
export type NodeAudioEncoder = NodeBase & {
  type?: 'audio_encoder';
  config?: AudioEncoderConfig;
};
export type NodeAsr = NodeBase & {
  type?: 'asr';
  config?: ASRNodeConfig;
};
export type NodeTranslate = NodeBase & {
  type?: 'translate';
  config?: TranslateNodeConfig;
};
export type NodeVoiceAgent = NodeBase & {
  type?: 'voice_agent';
  config?: VoiceAgentNodeConfig;
};
export type Sink =
  | SinkAxonkit
  | SinkLivekit
  | SinkJitsi
  | SinkDaily
  | SinkAgora
  | SinkRtmpPush
  | SinkSrtPush
  | SinkWhip
  | SinkSegment
  | SinkImage
  | SinkWebsocket;
export type SinkAxonkit = SinkBase & {
  type?: 'axonkit';
  config?: AxonkitSinkConfig;
};
export type SinkLivekit = SinkBase & {
  type?: 'livekit';
  config?: LivekitSinkConfig;
};
export type SinkJitsi = SinkBase & {
  type?: 'jitsi';
  config?: JitsiSinkConfig;
};
export type SinkDaily = SinkBase & {
  type?: 'daily';
  config?: DailySinkConfig;
};
export type SinkAgora = SinkBase & {
  type?: 'agora';
  config?: AgoraSinkConfig;
};
export type SinkRtmpPush = SinkBase & {
  type?: 'rtmp_push';
  config?: RTMPPushConfig;
};
export type SinkSrtPush = SinkBase & {
  type?: 'srt_push';
  config?: SRTPushConfig;
};
export type SinkWhip = SinkBase & {
  type?: 'whip';
  config?: WHIPPushConfig;
};
export type SinkSegment = SinkBase & {
  type?: 'segment';
  config?: SegmentSinkConfig;
};
export type SegmentSinkConfig =
  SegmentStorageS3 | SegmentStorageGcp | SegmentStorageAzure | SegmentStorageLocal;
export type SegmentStorageS3 = SegmentSinkConfigBase & {
  storageType?: 's3';
  storageConfig?: S3StorageConfig;
};
export type SegmentStorageGcp = SegmentSinkConfigBase & {
  storageType?: 'gcp';
  storageConfig?: GCPStorageConfig;
};
export type SegmentStorageAzure = SegmentSinkConfigBase & {
  storageType?: 'azure';
  storageConfig?: AzureStorageConfig;
};
export type SegmentStorageLocal = SegmentSinkConfigBase & {
  storageType?: 'local';
  storageConfig?: LocalStorageConfig;
};
export type SinkImage = SinkBase & {
  type?: 'image';
  config?: ImageSinkConfig;
};
export type ImageSinkConfig =
  ImageStorageS3 | ImageStorageGcp | ImageStorageAzure | ImageStorageLocal;
export type ImageStorageS3 = ImageSinkConfigBase & {
  storageType?: 's3';
  storageConfig?: S3StorageConfig;
};
export type ImageStorageGcp = ImageSinkConfigBase & {
  storageType?: 'gcp';
  storageConfig?: GCPStorageConfig;
};
export type ImageStorageAzure = ImageSinkConfigBase & {
  storageType?: 'azure';
  storageConfig?: AzureStorageConfig;
};
export type ImageStorageLocal = ImageSinkConfigBase & {
  storageType?: 'local';
  storageConfig?: LocalStorageConfig;
};
export type SinkWebsocket = SinkBase & {
  type?: 'websocket';
  config?: WebSocketSinkConfig;
};

/**
 * Job submitted to the avflow control plane. Generated from the Go definitions in github.com/avflowhq/avflow/pkg/avflow; do not edit by hand.
 */
export interface Job {
  name?: string;
  metadata?: {
    [k: string]: string;
  };
  /**
   * @minItems 1
   * @maxItems 5
   */
  sources?:
    | [Source]
    | [Source, Source]
    | [Source, Source, Source]
    | [Source, Source, Source, Source]
    | [Source, Source, Source, Source, Source];
  nodes?: Node[];
  /**
   * @minItems 1
   * @maxItems 3
   */
  sinks?: [Sink] | [Sink, Sink] | [Sink, Sink, Sink];
  policies?: Policies;
  id?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  error?: ErrorInfo;
  componentStatus?: {
    [k: string]: ComponentStatus;
  };
}
export interface SourceBase {
  name?: string;
  type?:
    | 'axonkit'
    | 'livekit'
    | 'jitsi'
    | 'daily'
    | 'agora'
    | 'rtmp_pull'
    | 'httpflv_pull'
    | 'hls_pull'
    | 'whep'
    | 'web_capture'
    | 'video_generator'
    | 'file_pull'
    | 'srt_pull'
    | 'rtsp_pull';
  config?: unknown;
}
export interface AxonkitSourceConfig {
  serverUrl?: string;
  token?: string;
  groupSid?: string;
  select?: SelectFilter;
}
export interface SelectFilter {
  mediaTypes?: ('audio' | 'video' | 'data')[];
  identities?: string[];
  excludeIdentities?: string[];
  trackSources?: string[];
  trackNames?: string[];
  trackSids?: string[];
}
export interface LivekitSourceConfig {
  serverUrl?: string;
  token?: string;
  select?: SelectFilter;
}
export interface JitsiSourceConfig {
  domain?: string;
  roomName?: string;
  token?: string;
  appId?: string;
  xmppId?: string;
  xmppPassword?: string;
  connectionOptions?: {};
  conferenceOptions?: {};
  select?: SelectFilter;
}
export interface DailySourceConfig {
  roomUrl?: string;
  token?: string;
  userName?: string;
  select?: SelectFilter;
}
export interface AgoraSourceConfig {
  appId?: string;
  channel?: string;
  token?: string;
  uid?: number | string;
  select?: SelectFilter;
}
export interface URLPullSourceConfig {
  url?: string;
  identity?: string;
  displayName?: string;
  headers?: {
    [k: string]: string;
  };
  startTimeoutMs?: number;
  stallTimeoutMs?: number;
  loop?: boolean;
}
export interface WebCaptureSourceConfig {
  url?: string;
  viewport?: WebCaptureViewport;
  gotoOptions?: WebCaptureGotoOptions;
  authenticate?: WebCaptureAuthenticate;
  cookies?: WebCaptureCookie[];
  setExtraHTTPHeaders?: {
    [k: string]: string;
  };
  waitForSelector?: WebCaptureWaitForSelector;
  waitForTimeout?: number;
  bestAttempt?: boolean;
  fps?: number;
  captureAudio?: boolean;
  captureElement?: string;
}
export interface WebCaptureViewport {
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
}
export interface WebCaptureGotoOptions {
  waitUntil?: string[];
  timeout?: number;
  referer?: string;
  referrerPolicy?: string;
}
export interface WebCaptureAuthenticate {
  username?: string;
  password?: string;
}
export interface WebCaptureCookie {
  name?: string;
  value?: string;
  domain?: string;
  path?: string;
  url?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
}
export interface WebCaptureWaitForSelector {
  selector?: string;
  timeout?: number;
  visible?: boolean;
  hidden?: boolean;
}
export interface VideoGeneratorSourceConfig {
  width?: number;
  height?: number;
  fps?: number;
  backgroundColor?: string;
}
export interface NodeBase {
  name?: string;
  type?:
    | 'video_mixer'
    | 'audio_mixer'
    | 'audio_resample'
    | 'video_encoder'
    | 'audio_encoder'
    | 'asr'
    | 'translate'
    | 'voice_agent';
  inputs?: InputRefs;
  config?: unknown;
}
export interface InputRef {
  name: string;
  select?: SelectFilter;
}
export interface VideoMixerConfig {
  canvas?: Canvas;
  layout?: Layout;
}
export interface Canvas {
  width?: number;
  height?: number;
  fps?: number;
  backgroundColor?: string;
  coordinateSystem?: string;
}
export interface Layout {
  mode?: string;
  common?: LayoutCommon;
  grid?: GridLayout;
  speaker?: SpeakerLayout;
  custom?: CustomLayout;
}
export interface LayoutCommon {
  emitLayoutInfo?: boolean;
  borderRadius?: number;
  showTiles?: string;
  slotVisibility?: string;
  avatar?: AvatarStyle;
  nameLabel?: NameLabel;
}
export interface AvatarStyle {
  sizeRatio?: number;
  textColor?: string;
  backgroundColor?: string;
}
export interface NameLabel {
  enabled?: boolean;
  position?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  padding?: number;
  borderRadius?: number;
  maxWidthRatio?: number;
}
export interface GridLayout {
  maxColumns?: number;
  gap?: number;
  fit?: string;
}
export interface SpeakerLayout {
  mainPriority?: MainPriorityRule[];
  mainRatio?: number;
  mainGap?: number;
  thumbnailGap?: number;
  mainFit?: string;
  maxThumbnails?: number;
  thumbnailPosition?: string;
  thumbnailRatio?: number;
  thumbnailAlign?: string;
  thumbnailFit?: string;
}
export interface MainPriorityRule {}
export interface CustomLayout {
  regions?: Region[];
}
export interface Region {
  name?: string;
  source?: MatchSource;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  zIndex?: number;
  fit?: string;
  placeholder?: Placeholder;
  style?: RegionStyle;
}
export interface MatchSource {
  sourceName?: string;
  identity?: string;
  trackSid?: string;
  trackSource?: string;
  trackName?: string;
  index?: number;
}
export interface Placeholder {
  image?: PlaceholderImage;
  text?: PlaceholderText;
}
export interface PlaceholderImage {
  url?: string;
  fit?: string;
  borderRadius?: number;
  width?: number;
  height?: number;
}
export interface PlaceholderText {
  content?: string;
  position?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}
export interface RegionStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
}
export interface AudioMixerConfig {
  sampleRate?: number;
  channels?: number;
  audioLevels?: AudioLevelConfig;
}
export interface AudioLevelConfig {
  enabled?: boolean;
  intervalMs?: number;
  levels?: number;
  floorDb?: number;
}
export interface AudioResampleConfig {
  sampleRate?: number;
  channels?: number;
}
export interface VideoEncoderConfig {
  codec?: string;
  bitrateBps?: number;
  keyframeIntervalSec?: number;
  enableBFrames?: boolean;
}
export interface AudioEncoderConfig {
  codec?: string;
  profile?: string;
  bitrateBps?: number;
  sampleRate?: number;
  channels?: number;
}
export interface ASRNodeConfig {
  language?: string;
}
export interface TranslateNodeConfig {
  targetLanguage?: string;
  echoTargetLanguage?: boolean;
}
export interface VoiceAgentNodeConfig {
  language?: string;
  instructions?: string;
  greeting?: string;
  voice?: string;
  interrupt?: boolean;
}
export interface SinkBase {
  name?: string;
  type?:
    | 'axonkit'
    | 'livekit'
    | 'jitsi'
    | 'daily'
    | 'agora'
    | 'rtmp_push'
    | 'srt_push'
    | 'whip'
    | 'segment'
    | 'image'
    | 'websocket';
  inputs?: InputRefs;
  config?: unknown;
}
export interface AxonkitSinkConfig {
  serverUrl?: string;
  token?: string;
  videoTrackName?: string;
  audioTrackName?: string;
  encoding?: EncodingConfig;
}
export interface EncodingConfig {
  videoCodec?: string;
  audioCodec?: string;
  audioProfile?: string;
  videoBitrateBps?: number;
  audioBitrateBps?: number;
  keyframeIntervalSec?: number;
  enableBFrames?: boolean;
}
export interface LivekitSinkConfig {
  serverUrl?: string;
  token?: string;
  videoTrackName?: string;
  audioTrackName?: string;
  encoding?: EncodingConfig;
}
export interface JitsiSinkConfig {
  domain?: string;
  roomName?: string;
  token?: string;
  appId?: string;
  displayName?: string;
  connectionOptions?: {};
  conferenceOptions?: {};
  encoding?: EncodingConfig;
}
export interface DailySinkConfig {
  roomUrl?: string;
  token?: string;
  userName?: string;
  encoding?: EncodingConfig;
}
export interface AgoraSinkConfig {
  appId?: string;
  channel?: string;
  token?: string;
  uid?: number | string;
  encoding?: EncodingConfig;
}
export interface RTMPPushConfig {
  urls?: string[];
  encoding?: EncodingConfig;
}
export interface SRTPushConfig {
  url?: string;
  encoding?: EncodingConfig;
}
export interface WHIPPushConfig {
  url?: string;
  headers?: {
    [k: string]: string;
  };
  encoding?: EncodingConfig;
}
export interface SegmentSinkConfigBase {
  storageType?: string;
  storageConfig?: unknown;
  format?: string;
  encoding?: EncodingConfig;
  segmentDurationSec?: number;
  maxPlaylistEntries?: number;
  caption?: SegmentCaptionConfig;
}
export interface SegmentCaptionConfig {
  showSpeaker?: boolean;
  textSplit?: CaptionTextSplitConfig;
}
export interface CaptionTextSplitConfig {
  enabled?: boolean;
  length?: number;
  lines?: number;
}
export interface S3StorageConfig {
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  pathPrefix?: string;
  filename?: string;
}
export interface GCPStorageConfig {
  bucket?: string;
  credentialsJson?: unknown;
  pathPrefix?: string;
  filename?: string;
}
export interface AzureStorageConfig {
  container?: string;
  accountName?: string;
  accountKey?: string;
  sasToken?: string;
  pathPrefix?: string;
  filename?: string;
}
export interface LocalStorageConfig {
  baseDir?: string;
}
export interface ImageSinkConfigBase {
  storageType?: string;
  storageConfig?: unknown;
  format?: string;
  intervalSec?: number;
  quality?: number;
  width?: number;
  height?: number;
}
export interface WebSocketSinkConfig {
  url?: string;
  headers?: {
    [k: string]: string;
  };
  subprotocols?: string[];
}
export interface Policies {
  maxDurationSec?: number;
  idleTimeoutSec?: number;
}
export interface ErrorInfo {
  code?: string;
  message?: string;
  timestamp?: string;
}
export interface ComponentStatus {
  status?: string;
  error?: ErrorInfo;
}
