export const radius = {
  none: 'rounded-none',
  '4': 'rounded',
  '6': 'rounded-[6px]',
  '8': 'rounded-lg',
  '16': 'rounded-2xl',
  '24': 'rounded-3xl',
  full: 'rounded-full',
};

export const radiusTop = {
  '4': 'rounded-t',
  '8': 'rounded-t-lg',
  '16': 'rounded-t-2xl',
  full: 'rounded-t-full',
};

export const radiusTopLeft = {
  '4': 'rounded-tl',
  '8': 'rounded-tl-lg',
  '16': 'rounded-tl-2xl',
  full: 'rounded-tl-full',
};

export const radiusTopRight = {
  '4': 'rounded-tr',
  '8': 'rounded-tr-lg',
  '16': 'rounded-tr-2xl',
  full: 'rounded-tr-full',
};

export const radiusBottom = {
  '4': 'rounded-b',
  '8': 'rounded-b-lg',
  '16': 'rounded-b-2xl',
  full: 'rounded-b-full',
};

export const radiusLeft = {
  '4': 'rounded-l',
  '8': 'rounded-l-lg',
  '16': 'rounded-l-2xl',
  full: 'rounded-l-full',
};

export const radiusRight = {
  '4': 'rounded-r',
  '8': 'rounded-r-lg',
  '16': 'rounded-r-2xl',
  full: 'rounded-r-full',
};

export type Radius = keyof typeof radius;
export type RadiusTop = keyof typeof radiusTop;
export type RadiusTopLeft = keyof typeof radiusTopLeft;
export type radiusTopRight = keyof typeof radiusTopRight;
export type RadiusBottom = keyof typeof radiusBottom;
export type RadiusLeft = keyof typeof radiusLeft;
export type RadiusRight = keyof typeof radiusRight;
export type RadiusPosition =
  | 'full'
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'left'
  | 'right'
  | 'none';
