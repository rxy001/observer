import {
  hasProto,
  arrayMethods,
  def,
  isPlainObject,
} from './util'
import {
  Dep
} from './dep'
import {
  isObject
} from 'util';

const arrayMethdosKey = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()

    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayMethdosKey)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(val) {
    for (let i = 0; i < val.length; i++) {
      observer(val[i])
    }
  }
  walk(value) {
    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(value, keys[i])
    }
  }
}

export function defineReactive(obj, key, val) {

  // dep和this.dep收集的依赖是相同的，方便在其他地方调用
  // 但如果value是基础类型，则无法创建__ob__，因此没有__ob__.dep
  const dep = new Dep()
  const descriptor = Object.getOwnPropertyDescriptor(obj, key)
  if (descriptor && descriptor.configurable === false) {
    return
  }
  const getter = descriptor && descriptor.get
  const setter = descriptor && descriptor.set

  // 如果getter存在 而且setter不存在，则无需监测其变化（即使对其赋值，也获取不到）
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  let childOb = observer(val)
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // if (Array.isArray(val)) {
          //   dependArray(val)
          // }
        }
      }
      return value
    },
    set(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observer(newVal)
      dep.notify()
    },
  })
}

function dependArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

function observer(val) {
  let ob
  if (val.hasOwnProperty('__ob__') && val.__ob__ instanceof Observer) {
    ob = val.__ob__
  } else if (Array.isArray(val) || isPlainObject(val)) {
    ob = new Observer(val)
  } 
  return ob
}

function protoAugment(arr, src) {
  arr.__proto__ = src
}

function copyAugment(arr, src, keys) {
  // Object.keys 只能获取对象自身可枚举属性
  // for-in 获取对象包含原型链上的可枚举属性
  // Object.getOwnPropertyNames 获取对象自身所有属性
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(arr, key, src[key])
  }
}