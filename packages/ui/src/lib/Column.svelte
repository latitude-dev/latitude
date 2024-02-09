<script lang="ts">
  import classNames from 'classnames';
  import gaps, { type Gap } from './tokens/gaps.ts';

  export let gap: Gap = 4;

  $: classes = classNames('flex flex-col', gaps[gap]);
</script>

<div class={classes}>
  <slot />
</div>
