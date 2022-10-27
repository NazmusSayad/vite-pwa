console.clear()
import fs from 'fs'
import cmd from 'child_process'
import builder from './builder.js'
const packagePath = './package.json'

const param = process.argv.at(-1)
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const updateVersion = (state = 1) => {
  const version = packageData.version.split('.').map((v) => +v)

  switch (param) {
    case 'patch':
      version[2] += state
      break

    case 'minor':
      version[1] += state
      break

    case 'major':
      version[0] += state
      break

    default:
      throw new Error('Invalid update type')
  }

  packageData.version = version.join('.')
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, '  '))
}

builder.build()
updateVersion()

try {
  const res = cmd.execSync('npm publish')
  console.log(res.toString())
} catch (err) {
  console.log(err.stderr.toString())
  updateVersion(-1)
}

try {
  cmd.execSync('git add .')
  cmd.execSync(`git commit -m "update ${param}@${packageData.version}"`)
  const res = cmd.execSync('git push')
  console.log(res.toString())
} catch (err) {
  console.log(err.stderr.toString())
}
