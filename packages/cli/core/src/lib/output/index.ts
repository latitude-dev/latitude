export default function output(message: string, ready: boolean) {
  if (ready) {
    console.log(message)
  }
}
