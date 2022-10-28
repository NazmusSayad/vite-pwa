# vite-pwa

This package helps you to cache your files with service worker.

<a href="https://npmjs.com/package/vite-pwa">
  <img src="https://img.shields.io/npm/v/vite-pwa" alt="npm package"> 
</a>

## Installation

- with npm

```shell
npm i -D vite-pwa
```

- with yarn

```shell
yarn add -D vite-pwa
```

- with pnpm

```shell
pnpm add -D vite-pwa
```

## Usage

Add `vitePwa()` (or whatever you decide to name your default import) to the list of plugins in the ViteJS configuration file (`vite.config.js`) of your project.

```js
import { defineConfig } from 'vite'
import vitePwa from 'vite-pwa'

export default defineConfig({
  //...
  plugins: [/*...*/ vitePwa()],
})
```

**Once you have done that, this will create everything's you need to make a pwa(I mean just Service Worker caching) in production mode**

## Configuration

```ts
type Options = {
  /**
   * Name of the worker file that will be generated
   */
  swDest: string = 'sw'

  /**
   * Name of the worker regiester file that will be generated
   */
  registerSwDest: string = 'swRegister'

  /**
   * If enabled file mappings will be generated
   */
  map: boolean = false

  /**
   * Name of the file mappings that will be generated.
   * Output: //
   * - /mappings.all.json [All the files that are inside the build folder]
   * - /mappings.build.json [All the files that is created by vite]
   */
  mapDest: string = 'mappings'

  /**
   * This enables spa(single page application) mode when there is no internet. All the requests will redirected to '/'
   */
  spa: boolean = true

  /**
   * If enabled 'service worker' and 'service worker register' files will be included in the pre-cache
   */
  preCacheSw: boolean = true

  /**
   * manually add files that will be precached
   */
  preCacheFiles: [string] = []

  /**
   * Check which files should be included in the pre cache list
   * 'true' -> all
   * 'RegExp' -> regex.test(fileName)
   * 'function' -> true | false
   * Anything else will be ignored
   */
  preCacheFilter: true | function | RegExp | any = null

  /**
   * Cache name for preCached files
   */
  preCacheName: string = 'pre-cache'

  /**
   * Cache name for runtime cached files
   */
  runtimeCacheName: string = 'runtime-cache'
}
```
