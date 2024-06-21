import { PROMPTS_DIR } from '../constants'
import { ModelManager } from '@latitude-data/llm-manager'
import sourceManager from './sourceManager'

const modelManager = new ModelManager(PROMPTS_DIR, sourceManager)
export default modelManager
