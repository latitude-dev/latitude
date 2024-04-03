import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type QueryResultPayload, useQuery } from '@latitude-data/react'
import MovieListSkeleton from '@/MovieListSkeleton'

function MovieList({ movies }: { movies: QueryResultPayload }) {
  return (
    <>
      <TableHeader>
        <TableRow>
          {movies.fields.map((field) => (
            <TableHead key={field.name}>{field.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, index) => (
              <TableCell key={index}>{String(cell)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

export default function Example() {
  const { data: movies, isFetching, compute } = useQuery({
    queryPath: 'titles/titles-table',
  })

  const caption = isFetching ? 'Loading movies...' : 'List of movies'
  const refresh = useCallback(() => compute(), [compute])

  return (
    <div className='p-4 flex flex-col gap-y-4'>
      <h1 className='text-4xl font-medium'>React example with Latitude</h1>
      <Button onClick={refresh}>Refresh</Button>

      <Table>
        {!isFetching ? <MovieList movies={movies!} /> : <MovieListSkeleton />}
        <TableCaption>{caption}</TableCaption>
      </Table>
    </div>
  )
}
