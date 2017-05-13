export function getPathPrefix (path) {
  return path.indexOf('http') !== -1 || path.indexOf('/tocbot') === 0
    ? path
    : '/tocbot' + path
}

export function getIndex (path) {
  return path === '/' ? '/index' : path
}
