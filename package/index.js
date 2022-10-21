import path from 'path'

export default function viteBasicCache({
  swDest = 'sw.js',
  registerSwDest = 'registerSw.js',
  cacheSw = true,
  preCache = ['/sw.js', '/manifest.json', '/icon.ico'],
  preCacheRegex = true,
  preCacheName = 'pre-cache',
  runtimeCacheName = 'runtime-cache',
} = {}) {
  const name = 'PWA-caching'
  if (process.env.NODE_ENV !== 'production') return { name }

  const swJsInput = path.join(__dirname, './sw.js')
  const registerSwInput = path.join(__dirname, './registerSw.js')

  swDest = path.join('/', swDest)
  registerSwDest = path.join('/', registerSwDest)

  if (cacheSw) preCache.push(swDest)
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
        const matchedFiles = Object.keys(modules).filter(fileName =>
          preCacheRegex.test(fileName)
        )
        preCache.push(...matchedFiles.map(fileName => path.join('/', fileName)))
      }

      const registerSwFile = modules[this.getFileName(registerSwRef)]
      const swFile = modules[this.getFileName(swFileRef)]

      registerSwFile.fileName = registerSwDest.replace(/^\//, '')
      swFile.fileName = swDest.replace(/^\//, '')

      registerSwFile.code = registerSwFile.code.replace('{swDest}', swDest)
      const newCode = swFile.code
        .replace(
          '[preCacheFiles]',
          JSON.stringify(Array.from(new Set(preCache)))
        )
        .replace('preCache', preCacheName)
        .replace('runtimeCache', runtimeCacheName)

      swFile.code =
        newCode +
        `\n// RANDOM: ${
          Math.random() * Math.random() +
          Math.random() -
          Math.random() / Math.random()
        }`
    },
  }
}
