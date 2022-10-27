import fs from 'fs'
import path from 'path'
import * as root from './root.js'

export default class VitePwaCore {
  name: string = root.name

  config: root.Config
  swRef: any
  swRegisterRef: any

  constructor(config: root.Config) {
    config = Object.assign({ ...root.defaultConfig }, config)
    this.config = config

    config.mapDest = path.join('/', config.mapDest)
    config.swDest = path.join('/', config.swDest + '.js')
    config.swRegisterDest = path.join('/', config.swRegisterDest + '.js')

    if (config.preCacheSw) {
      config.preCacheFiles.push(config.swDest, config.swRegisterDest)
    }
  }

  emitFile(arg) {}
}
