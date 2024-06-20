import React, { useEffect, useRef, useState } from 'react'
import { Box, Text, useInput } from 'ink'
import useResize from '../hooks/useResize.js'
import QueryResult, { DataType } from '@latitude-data/query_result'

const ROW_HEIGHT = 1
const MAX_COLUMN_WIDTH = 32
const MAX_READ_ROWS = 1000 // Number of rows that will be read to calculate the width of each column
const COL_GAP = 1

const headersBorderStyle = {
  bottom: '─',
  top: '─',
  left: '│',
  right: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '├',
  bottomRight: '┤',
}

type Column = {
  name: string
  type: DataType
  width: number
}

function getValueColor(type: DataType) {
  switch (type) {
    case DataType.String:
      return 'green'
    case DataType.Integer:
      return 'yellow'
    case DataType.Float:
      return 'yellow'
    case DataType.Boolean:
      return 'blue'
    default:
      return 'white'
  }
}

function serializeValue(value: any) {
  if (value === undefined) return 'undefined'
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return JSON.stringify(value)
}

export default function Table({ data }: { data: QueryResult }) {
  const [columns, setColumns] = useState<Column[]>([])
  const [tableWidth, setTableWidth] = useState(0)
  const [tableHeight, setTableHeight] = useState(0)

  const rowsContainerRef = useRef(null)
  useResize(rowsContainerRef, ({ width, height }) => {
    setTableWidth(width)
    setTableHeight(height)
  })

  const [rowsOffset, setRowsOffset] = useState(0)
  const [colsOffset, setColsOffset] = useState(0)
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })

  const [visibleRows, setVisibleRows] = useState(data.rows.slice(0, 10))
  const [visibleCols, setVisibleCols] = useState(columns)

  useEffect(() => {
    const cols: Column[] = []
    data.fields.forEach((field, fieldIndex) => {
      let width = field.name.length
      const rowsToRead = Math.min(data.rowCount, MAX_READ_ROWS)
      const topRows = data.rows.slice(0, rowsToRead / 2)
      const bottomRows = data.rows.slice(data.rowCount - rowsToRead / 2)
      const rows = [...topRows, ...bottomRows]
      rows.forEach((row) => {
        const value = serializeValue(row[fieldIndex])
        if (value?.length > width) width = value.length
      })

      cols.push({
        name: field.name,
        type: field.type,
        width: Math.min(width, MAX_COLUMN_WIDTH),
      })
    })
    setColumns(cols)
  }, [data])

  function moveSelection({
    row: rowDelta,
    col: colDelta,
  }: {
    row: number
    col: number
  }) {
    setSelectedCell((prev) => ({
      row: (prev.row + rowDelta + data.rowCount) % data.rowCount,
      col: (prev.col + colDelta + data.fields.length) % data.fields.length,
    }))
  }

  useInput((input, key) => {
    if (input === 'j' || key.downArrow) moveSelection({ row: 1, col: 0 })
    if (input === 'k' || key.upArrow) moveSelection({ row: -1, col: 0 })
    if (input === 'h' || key.leftArrow) moveSelection({ row: 0, col: -1 })
    if (input === 'l' || key.rightArrow) moveSelection({ row: 0, col: 1 })
  })

  useEffect(() => {
    const newVisibleRows = data.rows.slice(
      rowsOffset,
      rowsOffset + Math.max(1, Math.floor(tableHeight / ROW_HEIGHT)),
    )
    if (
      newVisibleRows.length !== visibleRows.length ||
      !newVisibleRows.every((row, idx) => row === visibleRows[idx])
    ) {
      setVisibleRows(newVisibleRows)
    }
  }, [rowsOffset, tableHeight, data.rows])

  useEffect(() => {
    const newVisibleCols = columns.slice(colsOffset).reduce((acc, col) => {
      const currentWidth =
        acc.reduce((acc, col) => acc + col.width, 0) +
        COL_GAP * Math.max(0, acc.length - 1)
      if (currentWidth >= tableWidth) return acc
      return [...acc, col]
    }, [])
    if (
      newVisibleCols.length !== visibleCols.length ||
      !newVisibleCols.every((col, idx) => col.name === visibleCols[idx].name)
    ) {
      setVisibleCols(newVisibleCols)
    }
  }, [tableWidth, colsOffset, columns])

  useEffect(() => {
    if (selectedCell.row < rowsOffset) {
      setRowsOffset(selectedCell.row)
    } else if (selectedCell.row >= rowsOffset + visibleRows.length) {
      setRowsOffset(selectedCell.row - visibleRows.length + 1)
    }

    if (selectedCell.col < colsOffset) {
      setColsOffset(selectedCell.col)
    } else if (selectedCell.col >= colsOffset + visibleCols.length) {
      setColsOffset(
        Math.min(columns.length - 1, selectedCell.col - visibleCols.length + 1),
      )
    }
  }, [selectedCell, visibleRows.length, visibleCols.length, columns.length])

  return (
    <Box
      flexGrow={1}
      flexDirection='column'
      flexWrap='nowrap'
      overflow='hidden'
      width='100%'
      position='relative'
    >
      <Box
        flexDirection='row'
        flexWrap='nowrap'
        overflow='hidden'
        position='relative'
        width='100%'
        height={4}
        gap={COL_GAP}
        borderStyle={headersBorderStyle}
        borderDimColor
      >
        {visibleCols.map((column, colIndex) => {
          const canShrink = colIndex === visibleCols.length - 1
          return (
            <Box
              key={colIndex}
              flexDirection='column'
              overflow='hidden'
              height={2}
              alignItems='flex-start'
              flexWrap='nowrap'
              flexBasis={column.width}
              width={column.width}
              flexShrink={canShrink ? 1 : 0}
            >
              <Text wrap='truncate' bold>
                {column.name +
                  ' '.repeat(Math.max(0, column.width - column.name.length))}
              </Text>
              <Text wrap='truncate' dimColor>
                {column.type +
                  ' '.repeat(Math.max(0, column.width - column.type.length))}
              </Text>
            </Box>
          )
        })}
      </Box>
      <Box flexGrow={1} borderStyle='single' borderDimColor borderTop={false}>
        <Box
          ref={rowsContainerRef}
          flexDirection='row'
          flexGrow={1}
          flexWrap='nowrap'
          overflow='hidden'
          gap={COL_GAP}
        >
          {visibleCols.map((column, colIndex) => {
            const colId = colIndex + colsOffset
            const isColSelected = selectedCell.col === colId
            if (colId >= data.fields.length) return null
            return (
              <Box
                key={colIndex}
                flexDirection='column'
                overflow='hidden'
                height={visibleRows.length * ROW_HEIGHT}
                alignItems='flex-start'
                flexWrap='nowrap'
                width={column.width}
                flexShrink={colIndex === visibleCols.length - 1 ? 1 : 0}
                flexBasis={column.width}
              >
                {visibleRows.map((item, rowIndex) => {
                  const rowId = rowIndex + rowsOffset
                  const isRowSelected = selectedCell.row === rowId
                  const value = serializeValue(item[colId])
                  return (
                    <Text
                      key={rowId}
                      inverse={isRowSelected && isColSelected}
                      wrap='truncate'
                      color={getValueColor(column.type)}
                      dimColor={!item[colId]}
                    >
                      {value +
                        ' '.repeat(Math.max(0, column.width - value.length))}
                    </Text>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
