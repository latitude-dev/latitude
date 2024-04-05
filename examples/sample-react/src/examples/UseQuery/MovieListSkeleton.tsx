import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { memo } from 'react'

export default memo(function MovieListSkeleton() {
  const headerCells = 7
  const rows = 10
  return (
    <>
      <TableHeader>
        <TableRow>
          {Array.from({ length: headerCells }, (_, index) => (
            <TableHead key={index}>
              <Skeleton className='w-[100px] h-4' />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: headerCells }, (_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className='w-[100px] h-4' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  )
})
