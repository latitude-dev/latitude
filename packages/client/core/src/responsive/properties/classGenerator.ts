import { flattenDeep } from 'lodash-es'
import { Properties, Property } from '.'
import { BP_LIST } from '../breakpoints'
import { responsiveProp } from '../utils'

export default function generateClasses({
  properties,
  propsWithNegatives = [],
}: {
  properties: Partial<Properties>
  propsWithNegatives?: Property[]
}) {
  return flattenDeep(
    Object.keys(properties).map((prop) => {
      const property = prop as keyof Properties
      const props = properties[property]
      if (!props) return []

      return Object.values(props).map((propValue) => {
        return BP_LIST.map((bp) =>
          responsiveProp({
            prop: propValue,
            bp,
            generateNegative: !!propsWithNegatives.find(
              (p) => p === property,
            ),
          }),
        )
      })
    }),
  ).join(' ')
}
