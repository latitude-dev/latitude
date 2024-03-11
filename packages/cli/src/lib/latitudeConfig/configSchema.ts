// TODO: Use schema/v1.schema.json instead of this file.
// when repo is public
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    // TODO: Once repo is public
    /* $schema: { */
    /*   type: 'string', */
    /*   format: 'uri', */
    /*   description: */
    /*     'JSON schema for this document, also used as a version indicator.', */
    /* }, */
    projectName: {
      type: 'string',
      description: 'Name of your project.',
    },
    appVersion: {
      type: 'string',
      minLength: 5,
      maxLength: 14,
      pattern: '^(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)$',
      description: 'Latitude app version used.',
    },
    deployPlatform: {
      type: 'string',
      enum: ['vercel', 'netlify', 'aws', 'cloudflare', 'nodejs'],
      default: 'nodejs',
      description:
        'Platform where the app is deployed (By default, it is nodejs).',
    },
  },
  /* required: ['$schema', 'appVersion'], */
  required: ['appVersion'],
  additionalProperties: false,
}

export default schema
