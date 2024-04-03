<script context="module" lang="ts">
  type FormInputEvent<T extends Event = Event> = T & {
    currentTarget: EventTarget & HTMLInputElement;
  };
  export type InputEvents = {
    blur: FormInputEvent<FocusEvent>;
    change: FormInputEvent<Event>;
    click: FormInputEvent<MouseEvent>;
    focus: FormInputEvent<FocusEvent>;
    focusin: FormInputEvent<FocusEvent>;
    focusout: FormInputEvent<FocusEvent>;
    keydown: FormInputEvent<KeyboardEvent>;
    keypress: FormInputEvent<KeyboardEvent>;
    keyup: FormInputEvent<KeyboardEvent>;
    mouseover: FormInputEvent<MouseEvent>;
    mouseenter: FormInputEvent<MouseEvent>;
    mouseleave: FormInputEvent<MouseEvent>;
    paste: FormInputEvent<ClipboardEvent>;
    input: FormInputEvent<InputEvent>;
  };
</script>

<script lang="ts">
  import { theme } from "@latitude-data/client"
  import { Label, Text } from "$lib"
  import type { HTMLInputAttributes } from "svelte/elements";

  type $$Props = HTMLInputAttributes & {
    label?: string;
    description?: string;
  }

  let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
  export let name: $$Props["name"] = undefined;
  export let label: $$Props["label"] = undefined;
  export let description: $$Props["description"] = undefined;
  export { className as class };
</script>

<div class={theme.ui.input.WRAPPER_CSS_CLASS}>
  {#if label}
    <Label for={name}>{label}</Label>
  {/if}
  <input
    class={theme.ui.input.cssClass({ className })}
    bind:value
    on:blur
    on:change
    on:click
    on:focus
    on:focusin
    on:focusout
    on:keydown
    on:keypress
    on:keyup
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:paste
    on:input
    {...$$restProps}
  />
  {#if description}
    <Text size="h5" color='muted'>{description}</Text>
  {/if}
</div>
