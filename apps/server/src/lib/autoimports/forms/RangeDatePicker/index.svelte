<script lang="ts">
  import { RangeDatePicker, type RangeDatePickerProps, type RangeDatePickerValue } from "@latitude-data/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams"
  import { RELATIVE_RANGES, RichDate } from "@latitude-data/custom_types"
  import { type Readable } from "svelte/store"

  type $$Props = Omit<RangeDatePickerProps, "value" | "onValueChange"> & {
    startParam: string;
    endParam: string;
    startValue?: string;
    endValue?: string;
  }
  export let startParam: $$Props["startParam"]
  export let endParam: $$Props["endParam"]
  export let startValue: $$Props["startValue"] = undefined
  export let endValue: $$Props["endValue"] = undefined

  const defaultRange = RELATIVE_RANGES['Current month'];
  const defaultValue = startValue && endValue
    ? { start: RichDate.fromString(startValue), end: RichDate.fromString(endValue) }
    : { start: new RichDate(defaultRange.start), end: new RichDate(defaultRange.end) };

  const actualStartValue = useViewParam(startParam, defaultValue.start) as Readable<RichDate>;
  const actualEndValue = useViewParam(endParam, defaultValue.end) as Readable<RichDate>;

  $: actualValue = { start: $actualStartValue, end: $actualEndValue }

  // Style and language of the date in the input button
  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";

  function onChange(value: RangeDatePickerValue): void {
    setViewParam(startParam, value.start);
    setViewParam(endParam, value.end);
  }
</script>
 
<RangeDatePicker
  value={actualValue}
  lang={lang}
  dateStyle={dateStyle}
  onValueChange={onChange}
  {...$$restProps}
/>