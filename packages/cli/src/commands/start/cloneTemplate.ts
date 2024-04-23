import colors from 'picocolors'
import degit from 'degit'
import { LATITUDE_GITHUB_SLUG } from '../constants'
import { onError } from '$src/utils'
import { TemplateUrl } from './questions'

const TEMPLATE_URL: Record<TemplateUrl, string> = {
  [TemplateUrl.default]: `${LATITUDE_GITHUB_SLUG}/template`,
  [TemplateUrl.duckdb]: `${LATITUDE_GITHUB_SLUG}/sample-duckdb`,
}

export default async function cloneTemplate({
  dest,
  force,
  template,
}: {
  dest: string
  force: boolean
  template: TemplateUrl
}) {
  return new Promise<string>((resolve) => {
    const gitTemplate = degit(TEMPLATE_URL[template], { force })
    console.log(`📦 Cloning template to ${dest}`)

    gitTemplate.on('info', () => {
      console.log(colors.green('✅ template cloned'))

      return resolve(dest)
    })

    gitTemplate.clone(dest).catch((err) => {
      onError({
        error: err,
        message: `💥 Error cloning template in ${dest}`,
      })
    })
  })
}
