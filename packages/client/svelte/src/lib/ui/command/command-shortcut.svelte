<script lang="ts">
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<span
  class={theme.ui.command.shortcut.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</span>
