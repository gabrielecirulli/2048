export default class EventSource {
  constructor() {
    this.reset();
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(f => f(data));
    }
  }

  reset() {
    this.events = {};
  }

  bind(event, source) {
    this.on(event, data => source.emit(event, data));
  }
}
