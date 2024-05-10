<script context="module" lang="ts">
  import { RichDate, RELATIVE_DATES, RelativeDate } from "@latitude-data/custom_types";

  export type DatePickerProps = {
    value: RichDate;
    dateStyle: 'full' | 'long' | 'medium' | 'short';
    lang: string;
    onValueChange: (value: RichDate) => void;
    class?: string;
  };

  type SelectorItem = { value: RelativeDate | undefined; label: string };
</script>

<script lang="ts">
  import { Calendar as CalendarIcon, LightningBolt as LightningBoltIcon } from "radix-icons-svelte";
  import { type DateValue, DateFormatter, fromDate, getLocalTimeZone } from "@internationalized/date";
  import { Button, Calendar, Popover, Select, ToggleGroup, Label, Text } from "$lib";
  import { theme } from "@latitude-data/client";
  import { writable } from "svelte/store"
  import { createEventDispatcher } from "svelte"

  type $$Props = DatePickerProps & {
    name?: string;
    label?: string;
    description?: string;
  }

  export let lang: $$Props["lang"] = "en-US";
  export let dateStyle: $$Props["dateStyle"] = "long";
  export let value: $$Props["value"] = new RichDate(RelativeDate.Today);
  export let onValueChange: $$Props["onValueChange"] = () => {};
  let className: $$Props["class"] = "";
  export { className as class };
  export let name: $$Props["name"] = "";
  export let label: $$Props["label"] = undefined;
  export let description: $$Props["description"] = undefined;

  const df = new DateFormatter(lang, { dateStyle });

  const dispatch = createEventDispatcher();
  const val = writable(value);
  function setValue(newValue: RichDate) {
    val.set(newValue);
    onValueChange(newValue);
    dispatch('change', newValue);
  }

  $: isRelative = $val.isRelative();
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
      setValue(new RichDate(RelativeDate.Today));
    } else {
      setValue(new RichDate($val.resolve()));
    }
    isSelectorOpen = value === ToggleValue.Relative;
    isCalendarOpen = !isSelectorOpen;
  }
  
  // Selector
  const selectorItems: SelectorItem[] = Object.entries(RELATIVE_DATES).map(([key, value]) => { return { value, label: key } });
  function onSelectChange(selected?: Select.Selected<string | undefined>): void {
    if (!selected?.value || !Object.values(RelativeDate).includes(selected.value as RelativeDate)) {
      return
    }

    setValue(new RichDate(selected.value as RelativeDate))
  }
  function relativeDateLabel(value: string): string {
    return Object.entries(RELATIVE_DATES).find(([_, v]) => v === value)?.[0] ?? ""
  }
  $: selectorValue = {
    label: isRelative ? relativeDateLabel($val.value as RelativeDate) : undefined,
    value: isRelative ? $val.value as RelativeDate : undefined,
  };

  // Calendar
  function onDateChange(dateValue?: DateValue): void {
    if (!dateValue) return;
    const date = dateValue.toDate(getLocalTimeZone());
    setValue(new RichDate(date));
  }
  $: calendarLabel = df.format($val.resolve());
  $: calendarValue = fromDate($val.resolve(), getLocalTimeZone());
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
        <Select.Trigger class={theme.ui.datePicker.SELECT_CSS_CLASS}>
          <Select.Value class={theme.ui.datePicker.SELECT_TEXT_CSS_CLASS} placeholder="Select Date" />
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
            class={theme.ui.datePicker.SELECT_CSS_CLASS}
            builders={[builder]}
          >
            <Text class={theme.ui.datePicker.SELECT_TEXT_CSS_CLASS}>
              {calendarLabel}
            </Text>
          </Button>
        </Popover.Trigger>
        <Popover.Content class={theme.ui.datePicker.POPOVER_CONTENT_CSS_CLASS}>
          <Calendar onValueChange={onDateChange} value={calendarValue} />
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
