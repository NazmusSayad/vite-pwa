import path from 'path'
import * as url from 'url'
import factory from './index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
export default factory(path, __dirname)
