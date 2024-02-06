export const colors = {
  backgrounds: {
    black: "bg-black",
    gray100: "bg-gray-100",
    gray200: "bg-gray-200",
    gray400: "bg-gray-400",
    gray600: "bg-gray-600",
    gray800: "bg-gray-800",
    gray900: "bg-gray-900",
    green100: "bg-green-100",
    green200: "bg-green-200",
    green400: "bg-green-400",
    green500: "bg-green-500",
    green1000: "bg-green-1000",
    green1200: "bg-green-1200",
    primary100: "bg-primary-100",
    primary200: "bg-primary-200",
    primary400: "bg-primary-400",
    primary500: "bg-primary-500",
    primary1000: "bg-primary-1000",
    primary1200: "bg-primary-1200",
    red100: "bg-red-100",
    red200: "bg-red-200",
    red400: "bg-red-400",
    red500: "bg-red-500",
    red1000: "bg-red-1000",
    red1200: "bg-red-1200",
    transparent: "bg-transparent",
    white: "bg-white",
    yellow100: "bg-yellow-100",
    yellow200: "bg-yellow-200",
    yellow400: "bg-yellow-400",
    yellow500: "bg-yellow-500",
    yellow1000: "bg-yellow-1000",
    yellow1200: "bg-yellow-1200"
  },
  textColors: {
    black: "text-black",
    gray1000: "text-gray-900",
    gray200: "text-gray-200",
    gray300: "text-gray-300",
    gray400: "text-gray-400",
    gray600: "text-gray-600",
    gray700: "text-gray-700",
    gray800: "text-gray-800",
    gray900: "text-gray-900",
    primary1000: "text-primary-1000",
    primary100: "text-primary-100",
    primary1200: "text-primary-1200",
    primary500: "text-primary-500",
    primary: "text-primary-1000",
    red1000: "text-red-1000",
    red100: "text-red-100",
    red1200: "text-red-1200",
    red500: "text-red-500",
    success1200: "text-green-1200",
    success500: "text-green-500",
    success: "text-green-1000",
    white: "text-white",
    yellow1000: "text-yellow-1000",
    yellow1200: "text-yellow-1200",
  }
};
export type TextColor = keyof typeof colors.textColors;
export type BackgroundColor = keyof typeof colors.backgrounds;
