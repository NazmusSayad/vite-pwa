import * as root from './root.js'
import VitePwa from './VitePwa.js'

export default (config: root.Config): VitePwa | {} => {
  if (process.env.NODE_ENV !== 'production') return { name: root.name }
  return new VitePwa(config)
}
