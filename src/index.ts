import * as root from './root.js'
import vitePwaCore from './vitePwa-core.js'

export default (conf: root.Config): any => {
  if (process.env.NODE_ENV !== 'production') return { name: root.name }
  return vitePwaCore(conf)
}
