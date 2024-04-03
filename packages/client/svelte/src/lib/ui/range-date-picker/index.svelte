<script context="module" lang="ts">
  import { RichDate, RELATIVE_RANGES } from "@latitude-data/custom_types";

  export type RangeDatePickerValue = {
    start: RichDate,
    end: RichDate
  }

  export type RangeDatePickerProps = {
    value?: RangeDatePickerValue;
    dateStyle: 'full' | 'long' | 'medium' | 'short';
    lang: string;
    onValueChange: ({ start, end }: RangeDatePickerValue) => void
    class?: string;
  };

  type SelectorItem = { value: string | undefined; label: string };
</script>

<script lang="ts">
  import { Calendar as CalendarIcon, LightningBolt as LightningBoltIcon } from "radix-icons-svelte";
  import { type DateValue, DateFormatter, fromDate, getLocalTimeZone } from "@internationalized/date";
  import { Button, RangeCalendar, Popover, Select, ToggleGroup, Text, Label } from "$lib";
  import { theme } from "@latitude-data/client";
  import { writable } from "svelte/store"
  import { createEventDispatcher } from "svelte"

  type $$Props = RangeDatePickerProps & {
    name?: string;
    label?: string;
    description?: string;
  }

  const defaultRange = RELATIVE_RANGES['Current month'];
  const defaultValue = {
    start: new RichDate(defaultRange.start),
    end: new RichDate(defaultRange.end)
  };

  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";
  export let value: $$Props["value"] = defaultValue;
  export let onValueChange: $$Props["onValueChange"] = () => {};
  let className: $$Props["class"] = "";
  export { className as class };
  export let name: $$Props["name"] = "";
  export let label: $$Props["label"] = undefined;
  export let description: $$Props["description"] = undefined;

  const df = new DateFormatter(lang, { dateStyle });
  
  const dispatch = createEventDispatcher();
  const val = writable(value);
  function setValue(newValue: RangeDatePickerValue) {
    val.set(newValue);
    onValueChange(newValue);
    dispatch('change', newValue);
  }

  $: isRelative = $val.start.isRelative() && $val.end.isRelative();
  let isSelectorOpen = false;
  let isCalendarOpen = false;

  // Toggle
  enum ToggleValue {
    Relative = "relative",
    Absolute = "absolute",
  }
  $: toggleValue = isRelative ? ToggleValue.Relative : ToggleValue.Absolute;
  function onToggleChange(value?: string | string[]): void {
    if (Array.isArray(value)) return;
    if (!value || value === toggleValue) return;

    if (value === ToggleValue.Relative) {
      setValue(defaultValue);
    } else {
      setValue({
        start: new RichDate($val.start.resolve()),
        end: new RichDate($val.end.resolve())
      });
    }
    isSelectorOpen = value === ToggleValue.Relative;
    isCalendarOpen = !isSelectorOpen;
  }

  // Selector
  const selectorItems: SelectorItem[] = Object.keys(RELATIVE_RANGES).map((key) => { return { value: key, label: key } });
  function onSelectChange(selected?: Select.Selected<string | undefined>): void {
    if (!selected?.value || !Object.keys(RELATIVE_RANGES).includes(selected.value)) {
      return
    }

    setValue({
      start: new RichDate(RELATIVE_RANGES[selected.value].start),
      end: new RichDate(RELATIVE_RANGES[selected.value].end)
    });
  }
  const relativeDateLabel = (value: RangeDatePickerValue): string => {
    return Object.entries(RELATIVE_RANGES).find(([_, v]) => v.start === value.start.value && v.end === value.end.value)?.[0] ?? ""
  }
  $: selectorValue = {
    label: isRelative ? relativeDateLabel($val) : undefined,
    value: isRelative ? relativeDateLabel($val) : undefined,
  };

  // Calendar
  function onDateChange(newRange: { start?: DateValue, end?: DateValue }): void {
    if (!newRange.start || !newRange.end) return;
    const newVal = {
      start: new RichDate(newRange.start.toDate(getLocalTimeZone())),
      end: new RichDate(newRange.end.toDate(getLocalTimeZone()))
    }
    setValue(newVal);
  }
  $: calendarLabel = `${df.format($val.start.resolve())} - ${df.format($val.end.resolve())}`;
  $: calendarValue = {
    start: fromDate($val.start.resolve(), getLocalTimeZone()),
    end: fromDate($val.end.resolve(), getLocalTimeZone())
  };
</script>

<div class={theme.ui.input.WRAPPER_CSS_CLASS}>
  {#if label}
    <Label for={name}>{label}</Label>
  {/if}
  
  <div class={theme.ui.datePicker.cssClass({ className })}>
    {#if isRelative}
      <Select.Root
        items={selectorItems}
        selected={selectorValue}
        onSelectedChange={onSelectChange}
        bind:open={isSelectorOpen}
      >
        <Select.Trigger class={theme.ui.datePicker.selectCssClass({ isRange: true })}>
          <Select.Value placeholder="Select Date" />
        </Select.Trigger>
        <Select.Content>
          {#each selectorItems as item}
            <Select.Item value={item.value}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    {:else}
      <Popover.Root openFocus bind:open={isCalendarOpen}>
        <Popover.Trigger asChild let:builder>
          <Button
            variant="outline"
            class={theme.ui.datePicker.buttonCssClass({ isRange: true })}}
            builders={[builder]}
          >
            {calendarLabel}
          </Button>
        </Popover.Trigger>
        <Popover.Content class={theme.ui.datePicker.POPOVER_CONTENT_CSS_CLASS}>
          <RangeCalendar onValueChange={onDateChange} value={calendarValue} />
        </Popover.Content>
      </Popover.Root>
    {/if}
    <ToggleGroup.Root type="single" value={toggleValue} onValueChange={onToggleChange} class={theme.ui.datePicker.TOGGLE_GROUP_CSS_CLASS}>
      <ToggleGroup.Item value={ToggleValue.Relative} class={theme.ui.datePicker.TOGGLE_BUTTON_CSS_CLASS}>
        <LightningBoltIcon class={theme.ui.datePicker.TOGGLE_ICON_CSS_CLASS} aria-label="Relative" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value={ToggleValue.Absolute} class={theme.ui.datePicker.TOGGLE_BUTTON_CSS_CLASS}>
        <CalendarIcon class={theme.ui.datePicker.TOGGLE_ICON_CSS_CLASS} aria-label="Absolute" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>

  {#if description}
    <Text size="h5" color='muted'>{description}</Text>
  {/if}
</div>