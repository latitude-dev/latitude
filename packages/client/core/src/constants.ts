export const TOKEN_PARAM = '__token'
export const DOWNLOAD_PARAM = '__download'
export const FORCE_REFETCH_PARAM = '__force'
export const STREAM_PARAM = '__stream'
export const PRIVATE_PARAMS = new Set([
  FORCE_REFETCH_PARAM,
  DOWNLOAD_PARAM,
  TOKEN_PARAM,
  STREAM_PARAM,
])
