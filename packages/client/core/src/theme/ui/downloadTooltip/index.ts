import { cn } from '../../utils'

export default {
  button: ({ className }: { className?: string } = {}) => {
    return cn(
      'border-color-gray-100 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border text-gray-400 hover:bg-gray-100',
      className,
    )
  },
  content: ({ className }: { className?: string } = {}) => {
    return cn('px-2 py-2 w-auto rounded-lg', className)
  },
  option: ({ className }: { className?: string } = {}) => {
    return cn('rounded-lg bg-gray-100 px-2 py-1', className)
  },
}
