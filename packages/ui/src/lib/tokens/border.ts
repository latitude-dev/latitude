import cn from 'classnames';

export const borderWidth = {
  none: 'border-0',
  '2': 'border-2',
};
export const borderWidthTop = {
  none: 'border-t-0',
  '2': 'border-t-2',
};
export const borderWidthBottom = {
  none: 'border-b-0',
  '2': 'border-b-2',
};
export const borderWidthLeft = {
  none: 'border-l-0',
  '2': 'border-l-2',
};
export const borderWidthRight = {
  none: 'border-r-0',
  '2': 'border-r-2',
};
export type BorderWidth = keyof typeof borderWidth;
export type BorderWidthTop = keyof typeof borderWidthTop;
export type BorderWidthBottom = keyof typeof borderWidthBottom;
export type BorderWidthLeft = keyof typeof borderWidthLeft;
export type BorderWidthRight = keyof typeof borderWidthRight;

export type BorderWidthOption =
  | undefined
  | null
  | {
      full: BorderWidth;
      top: BorderWidthTop;
      bottom: BorderWidthBottom;
      left: BorderWidthLeft;
      right: BorderWidthRight;
    };
export const useBorderWidth = (options: BorderWidthOption) => {
  if (!options || options === undefined) return '';

  return cn(
    borderWidth[options.full],
    borderWidthTop[options.top],
    borderWidthBottom[options.bottom],
    borderWidthLeft[options.left],
    borderWidthRight[options.right],
  );
};
