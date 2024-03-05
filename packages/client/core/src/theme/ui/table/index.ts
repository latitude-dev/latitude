import { cn } from '../../utils'

type Props = { className: string | null | undefined }

function tableCssClass({ className }: Props) {
  return cn('w-full caption-bottom text-sm', className)
}

function tableRowCssClass({ className }: Props) {
  return cn(
    'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    className
  )
}

function tableHeaderCssClass({ className }: Props) {
  return cn('[&_tr]:border-b', className)
}

function tableHeadCssClass({ className }: Props) {
  return cn(
    'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    className
  )
}

function tableFooterCssClass({ className }: Props) {
  return cn('bg-primary font-medium text-primary-foreground', className)
}

function tableCellCssClass({ className }: Props) {
  return cn(
    'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    className
  )
}

function tableCaptionCssClass({ className }: Props) {
  return cn('mt-4 text-sm text-muted-foreground', className)
}

function tableBodyCssClass({ className }: Props) {
  return cn('[&_tr:last-child]:border-0', className)
}

export default {
  container: { cssClass: () => 'w-full overflow-auto' },
  root: { cssClass: tableCssClass },
  row: { cssClass: tableRowCssClass },
  header: { cssClass: tableHeaderCssClass },
  head: { cssClass: tableHeadCssClass },
  footer: { cssClass: tableFooterCssClass },
  cell: { cssClass: tableCellCssClass },
  caption: { cssClass: tableCaptionCssClass },
  body: { cssClass: tableBodyCssClass },
}
