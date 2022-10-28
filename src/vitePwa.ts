import fs from 'fs'
import path from 'path'
import * as root from './root.js'
import lsFiles from 'node-ls-files'

export default (conf: root.Config, eConf: root.ExtraConfig) => {
  let swRef
  let swRegisterRef

  return {
    buildStart() {
      swRef = this.emitFile({
        type: 'chunk',
        id: root.swInputFile,
      })
      swRegisterRef = this.emitFile({
        type: 'chunk',
        id: root.swRegisterInputFile,
      })
    },

    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <script type="module" src="${conf.swRegisterDest}"></script>\n  </head>`
      )
    },

    generateBundle(config, bundle) {
      const swFile = bundle[this.getFileName(swRef)]
      const registerSwFile = bundle[this.getFileName(swRegisterRef)]

      swFile.fileName = eConf.swDest
      registerSwFile.fileName = eConf.swRegisterDest

      registerSwFile.code = registerSwFile.code.replace('_swDest_', conf.swDest)
    },

    writeBundle(config, bundle: { any }) {
      const allFiles = lsFiles.sync(config.dir, {
        relative: true,
        separator: '/',
        prefix: '/',
      })

      // Path mappings:
      if (conf.map) {
        allFiles.push(
          path.join('/', eConf.mapAllDest),
          path.join('/', eConf.mapBuildDest)
        )

        const buildFiles = Object.values(bundle).map(({ fileName }) => fileName)

        fs.mkdirSync(path.join(config.dir, path.dirname(eConf.mapAllDest)), {
          recursive: true,
        })
        fs.writeFileSync(
          path.join(config.dir, eConf.mapAllDest),
          JSON.stringify(allFiles)
        )
        fs.writeFileSync(
          path.join(config.dir, eConf.mapBuildDest),
          JSON.stringify(buildFiles)
        )
      }

      // SW Filter:
      let matchedFiles: string[] = []

      if (conf.preCacheFilter === true) {
        matchedFiles = allFiles
      } else if (conf.preCacheFilter instanceof Function) {
        matchedFiles = allFiles.filter((fileName) =>
          conf.preCacheFilter(path.parse(fileName), fileName)
        )
      } else if (conf.preCacheFilter instanceof RegExp) {
        matchedFiles = allFiles.filter((fileName) =>
          conf.preCacheFilter.test(fileName)
        )
      }

      conf.preCacheFiles.push(...matchedFiles)

      // SW operations:
      const swFile = bundle[this.getFileName(swRef)]
      const swFullPath = path.join(config.dir, swFile.fileName)

      const uniqueFiles = Array.from(new Set(conf.preCacheFiles))
      const replacedCode =
        swFile.code
          .replace('_preCache_', conf.preCacheName)
          .replace('_runtimeCache_', conf.runtimeCacheName)
          .replace('_spaEnabled_', conf.spa)
          .replace('_preCacheFiles_', JSON.stringify(uniqueFiles)) +
        root.getRandomRef()

      fs.writeFileSync(swFullPath, replacedCode)
    },

    // IGNORE:
    emitFile(_) {},
    getFileName(_): string {
      return 'none'
    },
  }
}
