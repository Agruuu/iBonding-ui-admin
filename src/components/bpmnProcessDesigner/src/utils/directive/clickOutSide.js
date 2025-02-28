//outside.js

const ctx = '@@clickoutsideContext'

export default {
  bind(el, binding, vnode) {
    const ele = el
    const documentHandler = (e) => {
      if (!vnode.context || ele.contains(e.target)) {
        return false
      }
      // Call instruction callback
      if (binding.expression) {
        vnode.context[el[ctx].methodName](e)
      } else {
        el[ctx].bindingFn(e)
      }
    }
    // Add method to ele
    ele[ctx] = {
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    }

    setTimeout(() => {
      document.addEventListener('touchstart', documentHandler) // Bind an event to the document.
    })
  },
  update(el, binding) {
    const ele = el
    ele[ctx].methodName = binding.expression
    ele[ctx].bindingFn = binding.value
  },
  unbind(el) {
    document.removeEventListener('touchstart', el[ctx].documentHandler) // Unbind
    delete el[ctx]
  }
}
