module.exports = (path, __dirname) =>
  function viteBasicCache({
    swDest = 'sw',
    registerSwDest = 'registerSw',
    spaEnabled = true,
    preCacheSw = true,
    preCacheFiles = [],
    preCacheRegex = null,
    preCacheName = 'pre-cache',
    runtimeCacheName = 'runtime-cache',
  } = {}) {
    const name = 'PWA-caching'
    if (process.env.NODE_ENV !== 'production') return { name }

    swDest = path.join('/', swDest) + '.js'
    registerSwDest = path.join('/', registerSwDest) + '.js'

    const swJsInput = path.join(__dirname, './sw.js')
    const registerSwInput = path.join(__dirname, './registerSw.js')

    if (preCacheSw) {
      preCacheFiles.push(swDest, registerSwDest)
    }
    let swFileRef, registerSwRef

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

      generateBundle(config, modules) {
        if (preCacheRegex instanceof RegExp) {
          const matchedFiles = Object.keys(modules).filter((fileName) =>
            preCacheRegex.test(fileName)
          )
          preCacheFiles.push(
            ...matchedFiles.map((fileName) => path.join('/', fileName))
          )
        }

        const registerSwFile = modules[this.getFileName(registerSwRef)]
        const swFile = modules[this.getFileName(swFileRef)]

        registerSwFile.fileName = registerSwDest.replace(/^\//, '')
        swFile.fileName = swDest.replace(/^\//, '')

        registerSwFile.code = registerSwFile.code.replace('_swDest_', swDest)
        const replacedCode = swFile.code
          .replace(
            '_preCacheFiles_',
            JSON.stringify(Array.from(new Set(preCacheFiles)))
          )
          .replace('_preCache_', preCacheName)
          .replace('_runtimeCache_', runtimeCacheName)
          .replace('_spaEnabled_', spaEnabled)

        swFile.code =
          replacedCode +
          `// Reference: ${
            Math.random().toString(35) +
            Math.random().toString(35) +
            Math.random().toString(36)
          }`
      },
    }
  }
