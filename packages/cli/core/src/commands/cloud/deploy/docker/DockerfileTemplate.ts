import { DOCKER_RUN, dockerinstall } from '$src/templates/Dockerfile'

export function DockerfileCloudTemplate() {
  return `
# syntax=docker/dockerfile:1
${dockerinstall()}

COPY <<-"EOT" ./copy-folders.sh
  #!/bin/sh

  # Copy contents into the shared volume
  mkdir -p /latitude-app/queries
  cp -r /usr/src/app/queries/. /latitude-app/queries
  cp /usr/src/app/latitude.json /latitude-app/latitude.json

  # Set read permissions
  chmod -R 755 /latitude-app

  exec "$@"
EOT

RUN chmod +x ./copy-folders.sh
ENTRYPOINT ["sh", "./copy-folders.sh"]

${DOCKER_RUN}
`
}
