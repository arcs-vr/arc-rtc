import { shallowRef } from 'vue'

export function useMediaQuery (queryString: string) {
  const query = window.matchMedia(queryString)
  const matches = shallowRef<boolean>(query.matches)

  function onChange (event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  query.addEventListener('change', onChange)

  return {
    matches,
  }
}
