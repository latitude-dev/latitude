import colors from 'picocolors'

export const APP_SERVER_FOLDER = 'apps/server'
export const PACKAGE_ORG = '@latitude-data'
export const CLI_PACKAGE_NAME = `${PACKAGE_ORG}/cli`
export const PACKAGE_NAME = `${PACKAGE_ORG}/server`
export const DEFAULT_VERSION_LIST = ['latest'] // If we fail to get the list
export const LATITUDE_CONFIG_FILE = 'latitude.json'
export const LATITUDE_FOLDER = '.latitude'
export const LATITUDE_GITHUB_SLUG = 'latitude-dev'

export const APP_FOLDER = `${LATITUDE_FOLDER}/app`
export const CLOUD_FOLDER = `${LATITUDE_FOLDER}/cloud`
export const GITHUB_STARTS_BANNER = `
    You can help us by giving a 🌟 on GitHub
    --------------------------------------
    ${colors.blue('http://github.com/latitude-dev/latitude')}

    Thanks! 🙏
`
