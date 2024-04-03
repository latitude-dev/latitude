<script lang="ts">
  import { DatePicker, type DatePickerProps } from "@latitude-data/svelte";
  import { RELATIVE_DATES, RichDate } from "@latitude-data/custom_types"
  import { setViewParam, useViewParam } from "$lib/stores/viewParams"
  import { type Readable } from "svelte/store"

  type $$Props = Omit<DatePickerProps, 'value'> & { param: string, value?: string, label?: string, description?: string }
  export let param: $$Props["param"]
  export let value: $$Props["value"] = undefined
  export let label: $$Props["label"] = undefined
  export let description: $$Props["description"] = undefined

  const defaultValue = value ? RichDate.fromString(value) : new RichDate(RELATIVE_DATES.Today);
  const actualValue = useViewParam(param, defaultValue) as Readable<RichDate>;

  // Style and language of the date in the input button
  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";

  function onChange(value: RichDate): void {
    setViewParam(param, value);
  }
</script>
 
<DatePicker
  value={$actualValue}
  name={param}
  label={label}
  description={description}
  lang={lang}
  dateStyle={dateStyle}
  onValueChange={onChange}
  {...$$restProps}
/>