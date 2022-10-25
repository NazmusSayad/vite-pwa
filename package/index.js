const readDir = require('./scripts/readDir')
const { getRelativePath, getRandomRef } = require('./scripts/utils')

module.exports = ({ path, fs }) =>
  function viteBasicCache({
    swDest = 'sw',
    registerSwDest = 'registerSw',
    mapDest = 'files',
    map: mapEnabled = true,
    spa: spaEnabled = true,
    preCacheSw = true,
    preCacheFiles = [],
    preCacheFilter = null,
    preCacheName = 'pre-cache',
    runtimeCacheName = 'runtime-cache',
  } = {}) {
    const name = 'Vite-PWA'
    if (process.env.NODE_ENV !== 'production') return { name }

    // Format file inputs
    mapDest = path.join('/', mapDest)
    swDest = path.join('/', `${swDest}.js`)
    registerSwDest = path.join('/', `${registerSwDest}.js`)

    // Source files
    const swJsInput = path.join(__dirname, './sw.js')
    const registerSwInput = path.join(__dirname, './registerSw.js')

    let swFileRef, registerSwRef
    if (preCacheSw) {
      preCacheFiles.push(swDest, registerSwDest)
    }

    return {
      name,

      buildStart() {
        swFileRef = this.emitFile({
          type: 'chunk',
          id: swJsInput,
        })
        registerSwRef = this.emitFile({
          type: 'chunk',
          id: registerSwInput,
        })
      },

      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `  <script type="module" src="${registerSwDest}"></script>\n  </head>`
        )
      },

      generateBundle(config, bundle) {
        const registerSwFile = bundle[this.getFileName(registerSwRef)]
        const swFile = bundle[this.getFileName(swFileRef)]

        registerSwFile.fileName = getRelativePath(registerSwDest)
        swFile.fileName = getRelativePath(swDest)

        registerSwFile.code = registerSwFile.code.replace('_swDest_', swDest)
      },

      writeBundle(config, bundle) {
        const allFiles = readDir({ path, fs }, config.dir)

        // Path mappings:
        if (mapEnabled) {
          const buildFiles = Object.values(bundle).map(
            ({ fileName }) => fileName
          )

          const allMapFile = getRelativePath(mapDest) + '.all.json'
          const buildMapFile = getRelativePath(mapDest) + '.build.json'
          allFiles.push(allMapFile, buildMapFile)

          fs.writeFileSync(
            path.join(config.dir, allMapFile),
            JSON.stringify(allFiles)
          )
          fs.writeFileSync(
            path.join(config.dir, buildMapFile),
            JSON.stringify(buildFiles)
          )
        }

        // SW Filter:
        if (preCacheFilter === true) {
          preCacheFiles.push(...allFiles)
        } else if (preCacheFilter instanceof RegExp) {
          const matchedFiles = allFiles.filter((fileName) =>
            preCacheFilter.test(fileName)
          )
          preCacheFiles.push(...matchedFiles)
        } else if (preCacheFilter instanceof Function) {
          const matchedFiles = allFiles.filter((fileName) =>
            preCacheFilter(fileName)
          )
          preCacheFiles.push(...matchedFiles)
        }

        const swFile = bundle[this.getFileName(swFileRef)]
        const swFilePath = path.join(config.dir, swFile.fileName)

        const uniqueFiles = Array.from(
          new Set(preCacheFiles.map((file) => path.join('/', file)))
        )
        const replacedCode =
          swFile.code
            .replace('_preCache_', preCacheName)
            .replace('_runtimeCache_', runtimeCacheName)
            .replace('_spaEnabled_', spaEnabled)
            .replace('_preCacheFiles_', JSON.stringify(uniqueFiles)) +
          getRandomRef()

        fs.writeFileSync(swFilePath, replacedCode)
      },
    }
  }
