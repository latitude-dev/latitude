<script lang="ts">
  import { Check, CaretSort } from 'radix-icons-svelte'
  import { Command, Popover, Button, ScrollArea, Text, Label } from '$lib'
  import { createEventDispatcher, tick } from 'svelte'
  import { theme } from '@latitude-data/client'
  type ComboboxItem = {
    value: unknown
    label: string
    disabled?: boolean
  }

  type $$Props = {
    items: ComboboxItem[]
    value?: unknown
    name?: string
    class?: string | null

    searchBox: boolean
    onSelect: (value: unknown) => void

    label?: string
    description?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    align?: 'start' | 'center' | 'end'
  }

  export let items: $$Props['items'] = []
  export let align: $$Props['align'] = 'start'
  export let value: $$Props['value'] = undefined
  export let name: $$Props['name'] = ''
  export let onSelect: $$Props['onSelect'] = () => {}
  export let searchBox: $$Props['searchBox'] = true
  export let label: $$Props['label'] = undefined
  export let description: $$Props['description'] = undefined
  export let placeholder: $$Props['placeholder'] = ''
  export let searchPlaceholder: $$Props['searchPlaceholder'] = placeholder
  export let emptyMessage: $$Props['emptyMessage'] = 'No items found.'
  let className: $$Props['class'] = null
  export { className as class }

  $: selectedValue = items.find((i) => i.value === value)?.label ?? placeholder

  let open = false

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  const dispatch = createEventDispatcher()

  function onSelectValue(selectedValue: unknown) {
    value = selectedValue
    onSelect(value)
    dispatch('change', value)
  }
</script>

<div class={theme.ui.input.WRAPPER_CSS_CLASS}>
  {#if label}
    <Label for={name}>{label}</Label>
  {/if}

  <Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        ellipsis
        aria-expanded={open}
        class={theme.ui.combobox.cssClass({ className })}
      >
        {selectedValue}

        <slot slot="icon">
          <CaretSort class={theme.ui.combobox.BUTTON_ICON_CSS_CLASS} />
        </slot>
      </Button>
    </Popover.Trigger>
    <Popover.Content {align} class={theme.ui.combobox.POPOVER_CSS_CLASS}>
      <Command.Root>
        {#if searchBox}
          <Command.Input
            placeholder={searchPlaceholder}
            class={theme.ui.combobox.SEARCH_BOX_CSS_CLASS}
          />
        {/if}
        <Command.Empty>{emptyMessage}</Command.Empty>
        <ScrollArea class={theme.ui.combobox.SCROLL_AREA_CSS_CLASS}>
          <Command.Group>
            {#each items as item}
              <Command.Item
                value={item.label}
                disabled={item.disabled ?? false}
                onSelect={() => {
                  onSelectValue(item.value)
                  closeAndFocusTrigger(ids.trigger)
                }}
              >
                <Check
                  class={theme.ui.combobox.checkIconCssClass({
                    isSelected: value === item.value,
                  })}
                />
                {item.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </ScrollArea>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>

  {#if description}
    <Text size="h5" color="muted">{description}</Text>
  {/if}
</div>
