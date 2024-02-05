import cn from "classnames";
import { ReactNode, forwardRef } from "react";
import {
  font,
  colors,
  whiteSpace as whiteSpaceOptions,
  wordBreak as wordBreakOptions,
} from "src/tokens";

import type {
  FontSize,
  FontWeight,
  FontSpacing,
  TextColor,
  WordBreak,
  WhiteSpace,
  TextGroupHoverColor,
} from "src/tokens";

type Display = "inline" | "inline-block" | "block";

export type Common = {
  children: ReactNode;
  color?: TextColor;
  groupHoverColor?: TextGroupHoverColor;
  centered?: boolean;
  capitalize?: boolean;
  uppercase?: boolean;
  wordBreak?: WordBreak;
  whiteSpace?: WhiteSpace;
  ellipsis?: boolean;
  display?: Display;
  userSelect?: boolean;
  noWrap?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  weight?: FontWeight;
};

export type TextProps = {
  size?: FontSize;
  weight?: FontWeight;
  spacing?: FontSpacing;
  centered?: boolean;
  capitalize?: boolean;
  wordBreak?: WordBreak;
  uppercase?: boolean;
  userSelect?: boolean;
};

type AllTextProps = TextProps & Common;
const Text = forwardRef<HTMLSpanElement, AllTextProps>(function Text(
  {
    children,
    size = "h4",
    color = "gray900",
    groupHoverColor,
    spacing = "normal",
    weight = "normal",
    display = "inline",
    uppercase = false,
    centered = false,
    capitalize = false,
    whiteSpace = "normal",
    wordBreak,
    ellipsis = false,
    userSelect = true,
    noWrap = false,
    underline = false,
    lineThrough = false,
  },
  ref,
) {
  const colorClass = colors.textColors[color];
  const groupHoverColorClass = colors.textGroupHover[groupHoverColor];
  const sizeClass = font.size[size];
  const weightClass = font.weight[weight];
  const spacingClass = font.spacing[spacing];
  const wordBreakClass = wordBreakOptions[wordBreak];
  const whiteSpaceClass = whiteSpaceOptions[whiteSpace];

  return (
    <span
      ref={ref}
      title={ellipsis && typeof children === "string" ? children : ""}
      className={cn(
        font.family.sans,
        sizeClass,
        weightClass,
        spacingClass,
        colorClass,
        groupHoverColorClass,
        wordBreakClass,
        whiteSpaceClass,
        display,
        {
          capitalize: capitalize,
          uppercase: uppercase,
          "text-center": centered,
          "text-left": !centered,
          truncate: ellipsis,
          "select-none": !userSelect,
          "whitespace-nowrap": noWrap,
          underline: underline,
          "line-through": lineThrough,
        },
      )}
    >
      {children}
    </span>
  );
});

// H1
const H1 = forwardRef<HTMLSpanElement, Common>(function H1(props, ref) {
  return <Text ref={ref} size="h1" {...props} />;
});

// H1B
const H1B = forwardRef<HTMLSpanElement, Common>(function H1(props, ref) {
  return <Text ref={ref} size="h1" weight="bold" {...props} />;
});

// H2
const H2 = forwardRef<HTMLSpanElement, Common>(function H2(props, ref) {
  return <Text ref={ref} size="h2" {...props} />;
});
const H2B = forwardRef<HTMLSpanElement, Common>(function H2B(props, ref) {
  return <Text ref={ref} size="h2" weight="bold" {...props} />;
});

// H3
const H3 = forwardRef<HTMLSpanElement, Common>(function H3(props, ref) {
  return <Text ref={ref} size="h3" {...props} />;
});
const H3B = forwardRef<HTMLSpanElement, Common>(function H3B(props, ref) {
  return <Text ref={ref} size="h3" weight="bold" {...props} />;
});

// H4
const H4 = forwardRef<HTMLSpanElement, Common>(function H4(props, ref) {
  return <Text ref={ref} size="h4" {...props} />;
});
const H4M = forwardRef<HTMLSpanElement, Common>(function H4M(props, ref) {
  return <Text ref={ref} size="h4" weight="medium" {...props} />;
});
const H4B = forwardRef<HTMLSpanElement, Common>(function H4B(props, ref) {
  return <Text ref={ref} size="h4" weight="semibold" {...props} />;
});

// H5
const H5 = forwardRef<HTMLSpanElement, Common>(function H5(props, ref) {
  return <Text ref={ref} size="h5" {...props} />;
});
const H5M = forwardRef<HTMLSpanElement, Common>(function H5M(props, ref) {
  return <Text ref={ref} size="h5" weight="medium" {...props} />;
});
const H5B = forwardRef<HTMLSpanElement, Common>(function H5B(props, ref) {
  return <Text ref={ref} size="h5" weight="semibold" {...props} />;
});

// H6
const H6 = forwardRef<HTMLSpanElement, Common>(function H6(props, ref) {
  return <Text ref={ref} size="h6" {...props} />;
});

const H6M = forwardRef<HTMLSpanElement, Common>(function H6M(props, ref) {
  return <Text ref={ref} size="h6" weight="medium" {...props} />;
});
const H6B = forwardRef<HTMLSpanElement, Common>(function H6B(props, ref) {
  return <Text ref={ref} size="h6" weight="semibold" {...props} />;
});

const H6C = forwardRef<HTMLSpanElement, Common>(function H6C(props, ref) {
  return (
    <Text
      ref={ref}
      uppercase
      size="h6"
      spacing="wide"
      weight="bold"
      {...props}
    />
  );
});

// H7
const H7 = forwardRef<HTMLSpanElement, Common>(function H7(props, ref) {
  return <Text ref={ref} size="h7" spacing="wide" weight="bold" {...props} />;
});

const H7C = forwardRef<HTMLSpanElement, Common>(function H7C(props, ref) {
  return (
    <Text
      ref={ref}
      uppercase
      size="h7"
      spacing="wide"
      weight="bold"
      {...props}
    />
  );
});

// H8
const H8 = forwardRef<HTMLSpanElement, Common>(function H8(props, ref) {
  return <Text ref={ref} size="h8" spacing="wide" weight="bold" {...props} />;
});

export type MonoProps = {
  color: TextColor;
  children: React.ReactNode;
  weight?: FontWeight | "normal" | "semibold" | "bold";
  userSelect?: boolean;
  ellipsis?: boolean;
  display?: Display;
  underline?: boolean;
  lineThrough?: boolean;
  size?: FontSize;
  textTransform?: "none" | "uppercase" | "lowercase";
  whiteSpace?: WhiteSpace;
};

const Mono = forwardRef<HTMLSpanElement, MonoProps>(function MonoFont(
  {
    color,
    children,
    whiteSpace,
    underline = false,
    lineThrough = false,
    size = "h6",
    textTransform = "none",
    userSelect = true,
    weight = "normal",
    ellipsis = false,
    display = "inline",
  },
  ref,
) {
  const sizeClass = font.size[size];

  return (
    <span
      ref={ref}
      className={cn(
        sizeClass,
        font.family.mono,
        font.weight[weight],
        colors.textColors[color],
        {
          [display]: !ellipsis,
          [whiteSpaceOptions[whiteSpace]]: !!whiteSpace,
          "block truncate": ellipsis,
          "select-none": !userSelect,
          "line-through": lineThrough,
          underline: underline,
          [textTransform]: textTransform !== "none",
        },
      )}
    >
      {children}
    </span>
  );
});

export default {
  H1,
  H1B,
  H2,
  H2B,
  H3,
  H3B,
  H4,
  H4B,
  H4M,
  H5,
  H5B,
  H5M,
  H6,
  H6B,
  H6C,
  H6M,
  H7,
  H7C,
  H8,
  Mono,
};
