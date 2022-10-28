import path from 'path'
import * as root from './root.js'
import vitePwa from './vitePwa.js'

export default (conf?: root.ConfigOptional): any => {
  if (process.env.NODE_ENV !== 'production') return { name: root.name }

  // START:

  const config = {
    ...root.defaultConfig,
    ...conf,
  }

  config.mapDest = path.join('/', config.mapDest)
  config.swDest = path.join('/', config.swDest + '.js')
  config.swRegisterDest = path.join('/', config.swRegisterDest + '.js')

  const extraConfg: root.ExtraConfig = {
    swDest: path.relative('/', config.swDest),
    swRegisterDest: path.relative('/', config.swRegisterDest),
    mapAllDest: path.relative('/', config.mapDest + '.all.json'),
    mapBuildDest: path.relative('/', config.mapDest + '.build.json'),
  }

  if (config.preCacheSw) {
    config.preCacheFiles.push(config.swDest, config.swRegisterDest)
  }

  return vitePwa(config, extraConfg)
}
