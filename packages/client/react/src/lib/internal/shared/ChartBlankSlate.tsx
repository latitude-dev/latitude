import { theme } from '@latitude-data/client'

const ChartPreview = () => (
  <svg
    preserveAspectRatio='none'
    viewBox='0 0 433 227'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='lat-w-full'
  >
    <path
      opacity='0.3'
      d='M54.5 108C26.5 110.755 11 149.205 0.712341 149.205V227H432.251V2.72327C402.5 2.72327 401.898 69.1613 375 72C348.102 74.8387 340.5 37.5 308.954 41.3948C277.408 45.2895 273.5 102.054 247.5 109.255C221.5 116.456 207.5 82.2714 178 86.5C148.5 90.7286 147.5 128.306 122 131.5C96.5 134.694 82.5 105.245 54.5 108Z'
      fill='url(#paint0_radial_8790_39437)'
    />
    <path
      d='M0.712341 149.205C11 149.205 25.5 109.255 53.5 106.5C81.5 103.745 96.5 134.694 122 131.5C147.5 128.306 148.5 90.7286 178 86.5C207.5 82.2714 221.5 116.456 247.5 109.255C273.5 102.054 270.408 46.1537 308.954 41.3948C347.5 36.6358 348.398 75.1613 375 71C401.602 66.8387 402.5 2.72327 432.251 2.72327'
      stroke='#F7F7F8'
      strokeWidth='4'
    />
    <defs>
      <radialGradient
        id='paint0_radial_8790_39437'
        cx='0'
        cy='0'
        r='1'
        gradientUnits='userSpaceOnUse'
        gradientTransform='translate(216 98) rotate(77.3302) scale(132.22 283.793)'
      >
        <stop stopColor='#EFF0F1' />
        <stop offset='1' stopColor='white' />
      </radialGradient>
    </defs>
  </svg>
)

export default function BlankSlate({ isLoading }: { isLoading: boolean }) {
  return (
    <div className={theme.ui.chart.blankSlateCssRoot({ loading: isLoading })}>
      <div className={theme.ui.chart.blankSlateCssContent()}>
        <ChartPreview />
      </div>
    </div>
  )
}
