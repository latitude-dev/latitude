import { flattenDeep } from 'lodash-es'
import { Properties } from '.'
import { BP_LIST } from '../breakpoints'
import { responsiveProp } from '../utils'


export default function generateClasses({
  properties,
}: {
  properties: Partial<Properties>
}) {
  return flattenDeep(
    Object.values(properties).map((props) =>
      Object.values(props).map((prop) =>
        BP_LIST.map((bp) => responsiveProp({ prop, bp }))
      )
    ),
  ).join(' ')
}
