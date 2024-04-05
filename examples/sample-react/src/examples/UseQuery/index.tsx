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
import MovieListSkeleton from './MovieListSkeleton'

function MovieList({ movies }: { movies?: QueryResultPayload }) {
  return (
    <>
      <TableHeader>
        <TableRow>
          {movies?.fields?.map((field) => (
            <TableHead key={field.name}>{field.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies?.rows.map((row, rowIndex) => (
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

export default function UseQuery() {
  const {
    data: movies,
    isFetching,
    compute,
    download
  } = useQuery({
    queryPath: 'titles/titles-table',
  })

  const caption = isFetching ? 'Loading movies...' : 'List of movies'
  const refresh = useCallback(() => compute(), [compute])

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-row gap-2'>
        <Button onClick={refresh}>Refresh</Button>
        <Button onClick={() => download()}>Download</Button>
      </div>

      <Table>
        {!isFetching ? <MovieList movies={movies!} /> : <MovieListSkeleton />}
        <TableCaption>{caption}</TableCaption>
      </Table>
    </div>
  )
}
