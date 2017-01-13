export const isProd = process.env.NODE_ENV === 'production'
export const isStaging = process.env.NODE_ENV === 'staging'
export const API_URL = apiUrl()
export const SUPPORTED_MODES = ['audio', 'position', 'color']

function apiUrl () {
  if (isProd) {
    return 'https://memory-n-back.herokuapp.com/api'
  }
  if (isStaging) {
    return 'https://memory-n-back-staging.herokuapp.com/api'
  }
  return 'http://10.0.0.7:3001/api' // use local machine IP to support react native http calls
}
