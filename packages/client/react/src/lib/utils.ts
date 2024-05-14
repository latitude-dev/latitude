import { theme as client } from '@latitude-data/client'

import type { ClassValue } from '@latitude-data/client'

export const cn = client.utils.cn as (...inputs: ClassValue[]) => string
