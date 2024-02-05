import React from "react";

import Text from "./index";
import type { TextProps } from "./index";

export default {
  title: "Text",
  component: Text,
  argTypes: {
    capitalize: "boolean",
    uppercase: "boolean",
    centered: "boolean",
  },
};

const H1Template = (args: TextProps) => (
  <Text.H1 {...args}>The quick brown fox jumps over the lazy dog</Text.H1>
);
export const H1 = H1Template.bind({});

const H2Template = (args: TextProps) => (
  <Text.H2 {...args}>The quick brown fox jumps over the lazy dog</Text.H2>
);
export const H2 = H2Template.bind({});

const H2BTemplate = (args: TextProps) => (
  <Text.H2B {...args}>The quick brown fox jumps over the lazy dog</Text.H2B>
);
export const H2B = H2BTemplate.bind({});

const H3Template = (args: TextProps) => (
  <Text.H3 {...args}>The quick brown fox jumps over the lazy dog</Text.H3>
);
export const H3 = H3Template.bind({});

const H3BTemplate = (args: TextProps) => (
  <Text.H3B {...args}>The quick brown fox jumps over the lazy dog</Text.H3B>
);
export const H3B = H3BTemplate.bind({});

const H4Template = (args: TextProps) => (
  <Text.H4 {...args}>The quick brown fox jumps over the lazy dog</Text.H4>
);
export const H4 = H4Template.bind({});
const H4MTemplate = (args: TextProps) => (
  <Text.H4M {...args}>The quick brown fox jumps over the lazy dog</Text.H4M>
);
export const H4M = H4MTemplate.bind({});
const H4BTemplate = (args: TextProps) => (
  <Text.H4B {...args}>The quick brown fox jumps over the lazy dog</Text.H4B>
);
export const H4B = H4BTemplate.bind({});

const H5Template = (args: TextProps) => (
  <Text.H5 {...args}>The quick brown fox jumps over the lazy dog</Text.H5>
);
export const H5 = H5Template.bind({});
const H5MTemplate = (args: TextProps) => (
  <Text.H5M {...args}>The quick brown fox jumps over the lazy dog</Text.H5M>
);
export const H5M = H5MTemplate.bind({});
const H5BTemplate = (args: TextProps) => (
  <Text.H5B {...args}>The quick brown fox jumps over the lazy dog</Text.H5B>
);
export const H5B = H5BTemplate.bind({});

const H6Template = (args: TextProps) => (
  <Text.H6 {...args}>The quick brown fox jumps over the lazy dog</Text.H6>
);
export const H6 = H6Template.bind({});
const H6MTemplate = (args: TextProps) => (
  <Text.H6M {...args}>The quick brown fox jumps over the lazy dog</Text.H6M>
);
export const H6M = H6MTemplate.bind({});
const H6BTemplate = (args: TextProps) => (
  <Text.H6B {...args}>The quick brown fox jumps over the lazy dog</Text.H6B>
);
export const H6B = H6BTemplate.bind({});

const H6CTemplate = (args: TextProps) => (
  <Text.H6C {...args}>The quick brown fox jumps over the lazy dog</Text.H6C>
);
export const H6C = H6CTemplate.bind({});

const H7CTemplate = (args: TextProps) => (
  <Text.H7C {...args}>The quick brown fox jumps over the lazy dog</Text.H7C>
);
export const H7C = H7CTemplate.bind({});

export const H8 = (args: TextProps) => (
  <Text.H8 {...args}>The quick brown fox jumps over the lazy dog</Text.H8>
);
