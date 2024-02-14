<script lang="ts">
  type Props = {
    label?: string;
    disabled?: boolean;
  };

  export let label: Props['label'] = ''
  export let disabled: Props['disabled'] = false
</script>

<button {disabled}>
  {label}
  <slot />
</button>

