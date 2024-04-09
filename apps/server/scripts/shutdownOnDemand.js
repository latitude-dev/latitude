import { server } from './server.js';

/**
 * This script is injected into the server build to allow the server to be shut down on demand. Otherwise,
 * the server does not properly shut down when the process is terminated, making the Docker container
 * unresponsive to `docker stop`.
 */
function shutdownServer() {
  server.server?.close(() => {
    process.exit(0);
  });
  server.server?.closeIdleConnections();
  setInterval(() => server.server?.closeIdleConnections(), 1_000);
  setTimeout(() => server.server?.closeAllConnections(), 20_000);
}

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);