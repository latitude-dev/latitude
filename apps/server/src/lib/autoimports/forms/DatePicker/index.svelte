<script lang="ts">
  import { DatePicker, type DatePickerProps } from "@latitude-data/svelte";
  import { RichDate } from "@latitude-data/custom_types"
  import { setViewParam } from "$lib/stores/viewParams"

  type $$Props = DatePickerProps & { param: string }
  export let param: $$Props["param"]
  export let value: $$Props["value"]

  // Style and language of the date in the input button
  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";

  function onChange(value: RichDate): void {
    setViewParam(param, value);
  }
</script>
 
<DatePicker
  value={value}
  lang={lang}
  dateStyle={dateStyle}
  onValueChange={onChange}
  {...$$restProps}
/>