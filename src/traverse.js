import {
  isObject
} from "util";

const seen = new Set()

// 递归调用该对象所有属性的getter
export function traverse(val) {
  _traverse(val, seen)
  seen.clear()
}

function _traverse(obj, seen) {
  const isA = Array.isArray(obj)
  if (!isA && !isObject(obj)  || Object.isFrozen(obj)) {
    return
  }

  // obj和子对象可能有不同属性引用同一个对象，
  if (obj.__ob__) {
    const depId = obj.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }

  if (isA) {
    let i = obj.length
    while (i--) _traverse(obj[i])
  } else {
    const keys = Object.keys(obj)
    let i = keys.length
    while (i--) {
      _traverse(obj[keys[i]])
    }
  }
}