import { cn } from '../../utils'

export function cssClass({ className, orientation }: { className?: string | null, orientation: 'horizontal' | 'vertical' }) {
  return cn(
		"flex touch-none select-none transition-colors",
		orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px",
		orientation === "horizontal" && "h-2.5 w-full border-t border-t-transparent p-px",
		className
	)
}

export function thumbCssClass({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  return cn("relative rounded-full bg-border", orientation === "vertical" && "flex-1")
}