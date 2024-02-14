<script lang="ts">
  import { type ButtonProps } from '.';

  export let role: ButtonProps['role'];
</script>

<button role={role}><slot name="label" /></button>
