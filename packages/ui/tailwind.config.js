import latitudeTheme from '@latitude-dev/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [latitudeTheme],
  content: ['./src/app.html', './src/**/*.{js,ts,jsx,tsx,svelte}'],
};
