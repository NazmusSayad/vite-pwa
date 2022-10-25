module.exports = ({ path, fs }, targetDir) => {
  const read = (rootDir) => {
    const files = fs.readdirSync(rootDir)

    files.forEach((file) => {
      const stats = fs.lstatSync(path.join(rootDir, file))

      if (stats.isDirectory()) {
        const newDir = path.join(rootDir, file)
        return read(newDir)
      }

      const fullPath = path.join(rootDir, file)
      const relativePath = path.relative(targetDir, fullPath)
      final.push(relativePath)
    })
  }

  const final = []
  read(targetDir)
  return final
}
