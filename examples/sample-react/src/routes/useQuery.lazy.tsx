import UseQuery from '@/examples/UseQuery'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/useQuery')({
  component: UseQuery,
})
