import Observer from './observer'
import { Watcher } from './watcher'

export default class V {
  constructor(options) {
    const watch = options.watch
    const data = options.data
    new Observer(data)
    const keys = Object.keys(watch)
    for (let i = 0; i < keys.length; i++) {
      new Watcher(data, keys[i], watch[keys[i]].handler || watch[keys[i]], watch[keys[i]].deep)
    }
    return data
  }
}