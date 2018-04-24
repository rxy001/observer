import { pushTarget, popTarget } from './dep'
import { traverse } from './traverse'
import { isObject, parsePath } from './util';

export class Watcher {
  constructor(vm, expOrFn, cb, deep = false) {
    this.vm = vm
    this.cb = cb
    this.deep = deep
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.deps = []
    this.depsId = new Set()
    this.value = this.get()
  }
  get() {
    pushTarget(this)
    const vm = this.vm
    
    // 将当前的watcher依次添加到该属性及父辈对象的dep中
    let value = this.getter.call(vm, vm)
    if (this.deep) {

      // 将当前的watcher依次添加该对象所有后代属性的dep
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
    return value
  }
  cleanupDeps() {}
  update() {
    this.run()
  }
  run() {
    const value = this.get()

    // value !== this.value || isObject(value) || this.deep ？？
    // 如果getter返回的为对象，value和this.value是相同的
    if (value !== this.value || isObject(value)) {
      const oldVal = this.value
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  }
  addDep(dep) {
    const depId = dep.id
    if (!this.depsId.has(depId)){
      this.depsId.add(depId)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}