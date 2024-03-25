import { createMasterKey } from "$src/commands/credentials/createMasterKey";
import { CLIConfig } from "$src/config";

export default function createDotEnv({ config }: { config: CLIConfig }) {
  createMasterKey({ config })
}
