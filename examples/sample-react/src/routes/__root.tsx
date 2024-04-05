import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const ACTIVE_CLASS = '[&.active]:text-blue-500'
export const Route = createRootRoute({
  component: () => (
    <div className='p-4 flex flex-col gap-y-4'>
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
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})
