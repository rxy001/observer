function def(obj, prop, value, enumerable = false) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

const bailRE = /[^\w.$]/
function parsePath(path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let index = 0; index < segments.length; index++) {
      if (!obj) return
      obj = obj[segments[index]]
    }
    return obj
  }
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object'  
}

function isPlainObject(obj){
  return obj.toString() === '[object Object]'
}

export {
  def,
  parsePath,
  isObject,
  isPlainObject
}