import { cn } from '../../utils'

type ClassProps = { className?: string | null | undefined }

export function rootCssClass({ className }: ClassProps) {
  return cn('rounded-xl border bg-card text-card-foreground shadow', className)
}

export function headerCssClass({ className }: ClassProps) {
  return cn('flex flex-col space-y-1.5 p-6', className)
}

export function titleCssClass({ className }: ClassProps) {
  return cn('font-semibold leading-none tracking-tight', className)
}

export function descriptionCssClass({ className }: ClassProps) {
  return cn('text-sm text-muted-foreground', className)
}

export function contentCssClass({ className }: ClassProps) {
  return cn('p-6 pt-0', className)
}

export function footerCssClass({ className }: ClassProps) {
  return cn('text-sm text-muted-foreground', className)
}
