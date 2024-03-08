import { cn } from '../../../utils'
import { buttonVariants } from '../../button'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    buttonVariants({ variant: "ghost" }),
    "h-8 w-8 p-0 font-normal",
    // Today
    "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
    // Selected
    "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
    // Disabled
    "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
    // Unavailable
    "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
    // Outside months
    "data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30",
    className
  )
}