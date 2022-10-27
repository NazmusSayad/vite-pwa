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

export const defaultConfig: Config = {
  swDest: 'sw',
  swRegisterDest: 'swRegister',
  mapDest: 'mappings',

  map: false,
  spa: true,

  preCacheSw: true,
  preCacheFiles: [],
  preCacheFilter: null,

  preCacheName: 'pre-cache',
  runtimeCacheName: 'runtime-cache',
}

export const name = 'Vite-PWA'

export const swInputFile = path.join(__dirname, '../assets/sw.js')
export const registerSwInputFile = path.join(
  __dirname,
  '../assets/registerSw.js'
)
