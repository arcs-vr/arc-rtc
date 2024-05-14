export function defineStore<T> (setup: () => T) {
  let store: Awaited<ReturnType<typeof setup>>

  async function getStore () {
    if (!store) {
      store = await setup()
    }

    return store
  }

  return getStore
}
