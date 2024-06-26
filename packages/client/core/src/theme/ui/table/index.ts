import { cn } from '../../utils'

type Props = { className?: string | null | undefined }

function containerCssClass({ className }: Props) {
  return cn(
    'lat-border lat-rounded-md lat-w-full lat-h-full lat-overflow-auto lat-whitespace-nowrap',
    className,
  )
}

function tableCssClass({ className }: Props) {
  return cn(
    'lat-w-full lat-caption-bottom lat-text-sm lat-table-auto',
    className,
  )
}

function tableRowCssClass({ className }: Props) {
  return cn(
    'lat-border-b lat-transition-colors hover:lat-bg-muted/50 data-[state=selected]:lat-bg-muted',
    className,
  )
}

function tableHeaderCssClass({ className }: Props) {
  return cn('[&_tr]:lat-border-b', className)
}

function tableHeadCssClass({ className }: Props) {
  return cn(
    'lat-h-10 lat-px-2 lat-text-left lat-align-middle lat-font-medium lat-text-muted-foreground [&:has([role=checkbox])]:lat-pr-0 [&>[role=checkbox]]:lat-translate-y-[2px]',
    className,
  )
}

function tableFooterCssClass({ className }: Props) {
  return cn(
    'lat-bg-primary lat-font-medium lat-text-primary-foreground',
    className,
  )
}

function tableCellCssClass({ className }: Props) {
  return cn(
    'lat-p-2 lat-max-w-80 lat-overflow-x-auto no-scrollbar lat-align-middle [&:has([role=checkbox])]:lat-pr-0 [&>[role=checkbox]]:lat-translate-y-[2px]',
    className,
  )
}

function tableCaptionCssClass({ className }: Props) {
  return cn('lat-mt-4 lat-text-sm lat-text-muted-foreground', className)
}

function tableBodyCssClass({ className }: Props) {
  return cn('[&_tr:last-child]:lat-border-0', className)
}

export default {
  container: { cssClass: containerCssClass },
  root: { cssClass: tableCssClass },
  row: { cssClass: tableRowCssClass },
  header: { cssClass: tableHeaderCssClass },
  head: { cssClass: tableHeadCssClass },
  footer: { cssClass: tableFooterCssClass },
  cell: { cssClass: tableCellCssClass },
  caption: { cssClass: tableCaptionCssClass },
  body: { cssClass: tableBodyCssClass },
}
