import Text from './Text'
import H1 from './H1'
import H2 from './H2'
import H3 from './H3'
import H4 from './H4'
import H5 from './H5'
import H5M from './H5M'
import H5B from './H5B'
import H6 from './H6'

type ComposedComponent = typeof Text & {
  H1: typeof H1
  H2: typeof H2
  H3: typeof H3
  H4: typeof H4
  H5: typeof H5
  H5M: typeof H5M
  H5B: typeof H5B
  H6: typeof H6
}
;(Text as ComposedComponent).H1 = H1
;(Text as ComposedComponent).H2 = H2
;(Text as ComposedComponent).H3 = H3
;(Text as ComposedComponent).H4 = H4
;(Text as ComposedComponent).H5 = H5
;(Text as ComposedComponent).H5M = H5M
;(Text as ComposedComponent).H5B = H5B
;(Text as ComposedComponent).H6 = H6

export default Text as ComposedComponent
