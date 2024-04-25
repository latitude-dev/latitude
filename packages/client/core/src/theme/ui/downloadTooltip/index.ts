import { cn } from '../../utils'

export default {
  button: ({ className }: { className?: string } = {}) => {
    return cn(
      'lat-border-color-gray-100 lat-flex lat-h-6 lat-w-6 lat-cursor-pointer lat-items-center lat-justify-center lat-rounded-full lat-border lat-text-gray-400 hover:lat-bg-gray-100',
      className,
    )
  },
  content: ({ className }: { className?: string } = {}) => {
    return cn('lat-px-2 lat-py-2 lat-w-auto lat-rounded-lg', className)
  },
  CONTENT_BOX_SHADOW:
    '0px 16px 80px 0px #07132414, 0px 8px 24px 0px #0713241F, 0px 0px 4px 0px #07132414',
  option: ({ className }: { className?: string } = {}) => {
    return cn('lat-rounded-lg lat-bg-gray-100 lat-px-2 lat-py-1', className)
  },
}
