import Embedding from '@/examples/Embedding'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/embedding')({
  component: Embedding,
})
