let id = 0

export class Dep{
  constructor() {
    this.subs = []
    this.id = id++
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  removeSub() {
    
  }
  depend() {
    Dep.target.addDep(this)
  }
  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      const element = this.subs[i];
      element.update()
    }
  }
}

Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}