import mitt from 'mitt'

interface Option {
  name: string // Event Name
  callback: Fn // Callback
}

const emitter = mitt()

export const useEmitt = (option?: Option) => {
  if (option) {
    emitter.on(option.name, option.callback)

    onBeforeUnmount(() => {
      emitter.off(option.name)
    })
  }

  return {
    emitter
  }
}
