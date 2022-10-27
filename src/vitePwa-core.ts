import path from 'path'
import * as root from './root.js'
import VitePwa from './vitePwa.js'

export default (conf: root.Config) => {
  conf = Object.assign({ ...root.defaultConfig }, conf)

  conf.mapDest = path.join('/', conf.mapDest)
  conf.swDest = path.join('/', conf.swDest + '.js')
  conf.swRegisterDest = path.join('/', conf.swRegisterDest + '.js')

  const extraConfg: root.ExtraConfig = {
    swDest: path.relative('/', conf.swDest),
    swRegisterDest: path.relative('/', conf.swRegisterDest),
    mapAllDest: path.relative('/', conf.mapDest + '.all.json'),
    mapBuildDest: path.relative('/', conf.mapDest + '.build.json'),
  }

  if (conf.preCacheSw) {
    conf.preCacheFiles.push(conf.swDest, conf.swRegisterDest)
  }

  return VitePwa(conf, extraConfg)
}
