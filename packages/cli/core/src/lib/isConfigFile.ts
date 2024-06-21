export default function isConfigFile(srcPath: string) {
  return srcPath.endsWith('.yml') || srcPath.endsWith('.yaml')
}
