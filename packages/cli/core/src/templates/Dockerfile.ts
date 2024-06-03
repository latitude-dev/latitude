export default function DockerfileTemplate() {
  return `
FROM node:18-slim AS base

RUN apt-get update && apt-get install -y curl
RUN npm install -g @latitude-data/cli@${process.env.PACKAGE_VERSION}

FROM base AS builder

WORKDIR /usr/src/app

COPY package.jso[n] .
COPY latitude.json .

RUN latitude setup --tty false

ARG MATERIALIZE_QUERIES='false'
RUN if [ "$MATERIALIZE_QUERIES" = "true" ]; then \
      echo "Materializing queries..."; \
      latitude materialize; \
    fi

FROM builder AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_module[s] ./node_modules
COPY --from=builder /usr/src/app/.latitude ./
COPY --from=builder /usr/src/app/latitude.json ./latitude.json
COPY . .

RUN latitude build --tty false

WORKDIR /usr/src/app/build

EXPOSE 3000

CMD ["node", "build"]
`
}
