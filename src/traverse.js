import { isObject } from "util";

const seen = new Set()

export function traverse(val) {
  _traverse(val, seen)
}

function _traverse(obj) {
  const isA = Array.isArray(obj)
  if (!isA && !isObject(obj)) {
    return
  }
  if (isA) {
    let i = obj.length
    while(i--) _traverse(obj[i])
  } else {
    const keys = Object.keys(obj)
    let i = keys.length
    while (i--) {
      _traverse(obj[keys[i]])
    }
  }
}