import { Input } from '@/components/ui/input'
import { LatitudeEmbed } from '@latitude-data/react'
import { useState } from 'react'

export default function Embedding() {
  const [name, setName] = useState('Paco')
  const [lastName, setLastName] = useState('Merlo')

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex items-center gap-x-2'>
        <Input
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          name='lastName'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className='p-3 shadow rounded-lg'>
        <LatitudeEmbed first={name} last={lastName} />
      </div>
    </div>
  )
}
