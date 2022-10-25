exports.getRelativePath = (fileName) => {
  return fileName.replace(/^\\+|^\/+/, '')
}

exports.getRandomRef = () => {
  return `// Reference: ${
    Math.random().toString(35) +
    Math.random().toString(35) +
    Math.random().toString(36)
  }`
}
