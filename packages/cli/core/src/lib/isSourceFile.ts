export default function isSourceFile(srcPath: string) {
  return srcPath.endsWith('.yml') || srcPath.endsWith('.yaml')
}
