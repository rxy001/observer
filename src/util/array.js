import {
  def
} from './lang'

const arrProto = Array.prototype
export const arrayMethods = Object.create(arrProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach((v, i) => {
  const original = arrProto[v]
  def(arrayMethods, v, function (...argments) {
    const result = original.apply(this, argments)
    let newAddArg
    const ob = this.__ob__
    switch (argments) {
      case "push":
      case 'unshift':
        newAddArg = argments
        break;
      case 'splice':
        newAddArg = argments.slice(2)
        break;
    }
    if (newAddArg) {
      ob.observeArray(newAddArg)
    }
    ob.dep.notify()
    return result
  })
})