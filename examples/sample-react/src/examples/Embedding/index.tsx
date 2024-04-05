import { useCallback, useRef, useState } from 'react'
import { useExample } from '@/components/ExampleProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useMeasure from '@/lib/useMeasure'
import Combobox, { Option } from '@/components/ui/combobox'
import {
  EmbeddingEvent,
  EmbeddingEventData,
  LatitudeEmbed,
  changeEmbedParams,
  runEmbedViewQuery,
  triggerCustomEvent,
} from '@latitude-data/react'

type StarWarsCharacter = {
  name: string
  url: string
}

export default function Embedding() {
  const starwarsFetched = useRef(false)
  const [characters, setCharacters] = useState<Option[]>([])
  const { headerHeight } = useExample()
  const [ref, { height }] = useMeasure<HTMLDivElement>()
  const topHeight = height + headerHeight
  const [endYear, setEndYear] = useState(2006)

  const runQuery = useCallback(() => {
    runEmbedViewQuery({ queryPaths: [], force: true })
  }, [])

  const fetchCharacters = useCallback(async (open: boolean) => {
    if (!open) return
    if (starwarsFetched.current) return

    try {
      const response = await fetch('https://swapi.dev/api/people')

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const results = (await response.json() as { results: StarWarsCharacter[] }).results
      const data = results.map((character: StarWarsCharacter) => ({
        label: character.name,
        value: character.url,
      }))
      setCharacters(data);
    } catch (error) {
      console.error('Failed to fetch character:', error);
    }
    starwarsFetched.current = true
  }, [starwarsFetched])

  return (
    <div className='flex flex-col gap-y-8'>
      <div ref={ref} className='relative flex items-center gap-x-2 border border-blue-500 rounded-md p-4 pt-6'>
        <div className='absolute -top-2.5 left-4 px-2 py-0.5 text-xs text-blue-700 uppercase rounded border border-blue-500 bg-white'>Your React app</div>
        <Button onClick={runQuery}>Run</Button>
        <div className='flex-grow-0'>
          <Input
            type='number'
            name='name'
            value={endYear}
            onChange={(e) => {
              const value = Number(e.target.value)
              changeEmbedParams({ end_year: value })
              setEndYear(value)
            }}
          />
        </div>
        <Combobox
          options={characters}
          onChange={(selected) => {
            triggerCustomEvent(selected)
          }}
          onOpen={fetchCharacters}
          placeholder='Pick your character'
          emptyMessage='No star wars character found in the Galaxy'
        />
      </div>
      <div
        className='shadow border border-orange-500 rounded-md p-4 relative'
        style={{ height: `calc(100vh - ${topHeight}px)` }}
      >
        <div className='absolute -top-2.5 left-4 px-2 py-0.5 text-xs text-orange-700 uppercase rounded border border-orange-500 bg-white'>Latitude iframe</div>
        {/* FIXME: Types are wrong in generated component */}
        {/* This needs more investigation */}
        <LatitudeEmbed
          url='http://localhost:3000'
          params={{ start_year: 2003, end_year: endYear }}
          onParamsChanged={(event: CustomEvent<EmbeddingEventData<EmbeddingEvent.ParamsChanged>>) => {
            const params = event.detail.params
            const newEndYear = params.end_year as number
            if (endYear === newEndYear) return

            setEndYear(newEndYear)
          }}
        />
      </div>
    </div>
  )
}
