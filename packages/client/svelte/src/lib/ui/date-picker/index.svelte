<script context="module" lang="ts">
  import { RelativeDate, RichDate } from "@latitude-data/custom_types";

  export type DatePickerProps = {
    value: RichDate;
    dateStyle: 'full' | 'long' | 'medium' | 'short';
    lang: string;
    onValueChange: (value: RichDate) => void;
  };

  type SelectorItem = { value: RelativeDate | undefined; label: string };
</script>

<script lang="ts">
  import { Calendar as CalendarIcon } from "radix-icons-svelte";
  import { type DateValue, DateFormatter, fromDate, getLocalTimeZone } from "@internationalized/date";
  import { Button, Calendar, Popover, Select } from "$lib";
  import { theme } from "@latitude-data/client";
  import { writable } from "svelte/store"
  import { createEventDispatcher } from "svelte"

  type $$Props = DatePickerProps;

  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";
  export let value: $$Props["value"] = new RichDate(RelativeDate.Today);
  export let onValueChange: $$Props["onValueChange"] = () => {};

  const df = new DateFormatter(lang, { dateStyle });
  const customEntry: SelectorItem = { value: undefined, label: "Custom" };

  const items: SelectorItem[] = [
    ...Object.entries(RelativeDate).map(([key, value]) => { return { value, label: key } }),
    customEntry,
  ];

  function relativeDateLabel(value: string): string {
    return Object.entries(RelativeDate).find(([_, v]) => v === value)?.[0] ?? ""
  }

  const resolveSelectorValue = (date: RichDate): SelectorItem => ({
    label: date.isRelative() ? relativeDateLabel(date.value as RelativeDate) : customEntry.label,
    value: date.isRelative() ? date.value as RelativeDate : undefined,
  });

  const val = writable(value);

  const dispatch = createEventDispatcher();

  $: displayedLabel = $val.isRelative() ? relativeDateLabel($val.value as string) : df.format($val.resolve());
  $: selectorValue = resolveSelectorValue($val);
  $: showCalendar = !$val.isRelative();
  $: calendarValue = fromDate($val.resolve(), getLocalTimeZone());

  function onSelectChange(selected?: Select.Selected<string | undefined>): void {
    if (!selected?.value) {
      val.set(new RichDate());
    } else if (Object.values(RelativeDate).includes(selected.value as RelativeDate)) {
      val.set(new RichDate(selected.value as RelativeDate));
    } else {
      return;
    }
    onValueChange($val);
    dispatch('change', $val);
  }

  function onDateChange(dateValue?: DateValue): void {
    if (!dateValue) return;
    const date = dateValue.toDate(getLocalTimeZone());
    val.set(new RichDate(date));
    onValueChange($val);
    dispatch('change', $val);
  }
</script>

<Popover.Root openFocus>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      class={theme.ui.date_picker.BUTTON_CSS_CLASS}
      builders={[builder]}
    >
      <CalendarIcon class={theme.ui.date_picker.CALENDAR_ICON_CSS_CLASS} aria-label="Calendar" />
      {displayedLabel}
    </Button>
  </Popover.Trigger>
  <Popover.Content class={theme.ui.date_picker.POPOVER_CONTENT_CSS_CLASS}>
    <div class={theme.ui.date_picker.POPOVER_INNER_CSS_CLASS}>
      <Select.Root
        {items}
        selected={selectorValue}
        onSelectedChange={onSelectChange}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select Date" />
        </Select.Trigger>
        <Select.Content>
          {#each items as item}
            <Select.Item value={item.value}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    {#if showCalendar}
      <div class="rounded-md border">
        <Calendar onValueChange={onDateChange} value={calendarValue} />
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
