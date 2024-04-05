import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import useMeasure from '@/lib/useMeasure'
import { ExampleProvider } from '@/components/ExampleProvider'

const ACTIVE_CLASS = '[&.active]:text-blue-500'

function RootComponent() {
  const [ref, { height }] = useMeasure<HTMLDivElement>()
  return (
    <div className='p-4 flex flex-col gap-y-4'>
      <div ref={ref} className='flex flex-col gap-y-2'>
        <h1 className='text-4xl font-medium'>Latitude in React</h1>
        <div className='p-2 flex gap-2'>
          <Link to='/' className={ACTIVE_CLASS}>
            Home
          </Link>
          {' | '}
          <Link to='/useQuery' className={ACTIVE_CLASS}>
            useQuery
          </Link>
          {' | '}
          <Link to='/embedding' className={ACTIVE_CLASS}>
            Embedding
          </Link>
        </div>
        <hr />
      </div>
      <ExampleProvider headerHeight={height}>
        <Outlet />
      </ExampleProvider>
      <TanStackRouterDevtools />
    </div>
  )
}
export const Route = createRootRoute({
  component: RootComponent,
})
