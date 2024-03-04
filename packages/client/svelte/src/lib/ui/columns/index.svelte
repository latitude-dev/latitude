<script lang="ts">
  import { tokens } from '@latitude-sdk/client'
  // TODO: Make a resize observer to get the width.
  <!-- import useSize from '@react-hook/size' -->

  type $$Props = {
    as?: 'div' | 'span' | 'ol' | 'ul'
    space?: tokens.gap
    collapseBelow?: tokens.breakpoints
    align?: Omit<tokens.justifyContent, 'between' | 'around'>
    alignY?: tokens.alignItems
  }

  export let as: $$Props['as'] = 'div'
  export let space: $$Props['space'] = 'none'
  export let collapseBelow: $$Props['collapseBelow']
  export let align: $$Props['align'] = 'start'
  export let alignY: $$Props['alignY'] = 'start'
</script>

export function Columns({
  as = 'div',
  space = 'none',
  align = 'start',
  alignY = 'start',
  collapseBelow,
  children,
}: ColumnsProps) {
  const target = React.useRef(null)
  const [width] = useSize(target)

  // default set up
  let flexDirection: Atoms['flexDirection'] = 'row'
  let justifyContent: Atoms['justifyContent'] = align
  let alignItems: Atoms['alignItems'] = alignY
  let ref = null

  if (collapseBelow !== undefined && typeof collapseBelow === 'number') {
    // switch orientation and swap alignment axis if collapsed
    if (width < collapseBelow) {
      flexDirection = 'column'
      justifyContent = alignY
      alignItems = align
    }

    // attach ref only if `collapseBelow` is given
    ref = target
  }

  const className = atoms({
    display: 'flex',
    flexDirection,
    gap: space,
    justifyContent,
    alignItems,
  })

  return React.createElement(as, { ref, className }, children)
}

