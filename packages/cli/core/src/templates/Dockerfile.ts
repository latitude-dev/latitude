import config from '$src/config'

function cliVersion() {
  if (config.dev) return 'latest'

  return process.env.PACKAGE_VERSION
}

export function dockerinstall() {
  return `
FROM node:18-slim AS base

RUN apt-get update && apt-get install -y curl
RUN npm install -g @latitude-data/cli@${cliVersion()}

FROM base AS builder

WORKDIR /usr/src/app

COPY package.jso[n] .
COPY latitude.json .

RUN latitude setup --tty false

FROM builder AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_module[s] ./node_modules
COPY --from=builder /usr/src/app/.latitude ./
COPY --from=builder /usr/src/app/latitude.json ./latitude.json
COPY . .

RUN latitude build --tty false

WORKDIR /usr/src/app/build

EXPOSE 3000
`
}
export const DOCKER_RUN = 'CMD ["node", "build"]'

export default function DockerfileTemplate() {
  return `${dockerinstall()}\n${DOCKER_RUN}`
}
