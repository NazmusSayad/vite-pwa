import fs from 'fs'
import path from 'path'
import * as root from './root.js'
import VitePwaCore from './VitePwa-Core.js'

export default class VitePwa extends VitePwaCore {
  buildStart() {
    this.swRef = this.emitFile({
      type: 'chunk',
      id: root.swInputFile,
    })
    this.swRegisterRef = this.emitFile({
      type: 'chunk',
      id: root.registerSwInputFile,
    })
  }
}
