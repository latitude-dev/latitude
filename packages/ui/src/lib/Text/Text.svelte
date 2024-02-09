<script lang="ts">
  import { colors, type TextColor } from '$lib/tokens/colors.ts';
  import { font, type FontSize, type FontSpacing, type FontWeight } from '$lib/tokens/font.ts';
  import { wordBreak as wordBreakOpts, whiteSpace as whiteSpaceOpts } from '$lib/tokens/index.ts';
  import classNames from 'classnames';

  import type { WhiteSpace } from '$lib/tokens/whiteSpace.ts';
  import type { WordBreak } from '$lib/tokens/wordBreak.ts';

  export let capitalize = false;
  export let centered = false;
  export let color: TextColor = 'gray900';
  export let ellipsis = false;
  export let lineThrough = false;
  export let noWrap = false;
  export let size: FontSize;
  export let underline = false;
  export let uppercase = false;
  export let userSelect = false;
  export let spacing: FontSpacing;
  export let weight: FontWeight;
  export let whiteSpace: WhiteSpace;
  export let wordBreak: WordBreak;

  const colorClass = colors.textColors[color];
  const sizeClass = font.size[size];
  const weightClass = font.weight[weight];
  const spacingClass = font.spacing[spacing];
  const wordBreakClass = wordBreakOpts[wordBreak];
  const whiteSpaceClass = whiteSpaceOpts[whiteSpace];

  $: classes = classNames(
    colorClass,
    sizeClass,
    weightClass,
    spacingClass,
    colorClass,
    wordBreakClass,
    whiteSpaceClass,
    {
      'line-through': lineThrough,
      'select-none': !userSelect,
      'text-center': centered,
      'text-left': !centered,
      'whitespace-nowrap': noWrap,
      capitalize: capitalize,
      truncate: ellipsis,
      underline: underline,
      uppercase: uppercase,
    },
  );
</script>

<span class={classes}>
  <slot />
</span>
