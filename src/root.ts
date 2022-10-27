import path from 'path'

export type Config = {
  swDest: string
  swRegisterDest: string
  mapDest: string

  map: boolean
  spa: boolean

  preCacheSw: boolean
  preCacheFiles: string[]
  preCacheFilter: true | RegExp | Function | any

  preCacheName: string
  runtimeCacheName: string
}

export type ExtraConfig = {
  swDest: string
  swRegisterDest: string
  mapAllDest: string
  mapBuildDest: string
}

export const defaultConfig: Config = {
  swDest: 'sw',
  swRegisterDest: 'swRegister',
  mapDest: 'mappings',

  map: true,
  spa: true,

  preCacheSw: true,
  preCacheFiles: [],
  preCacheFilter: null,

  preCacheName: 'pre-cache',
  runtimeCacheName: 'runtime-cache',
}

export const name = 'Vite-PWA'

export const swInputFile = path.join(__dirname, '../../assets/sw.js')
export const swRegisterInputFile = path.join(
  __dirname,
  '../../assets/swRegister.js'
)

export const getRandomRef = () => {
  return `// Reference: ${
    Math.random().toString(35) +
    Math.random().toString(35) +
    Math.random().toString(36)
  }`
}
