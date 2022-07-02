import { cache } from './cache'
import { useCache } from '@matthamlin/simple-cache/server'

export function useData<Data>(endpoint: string) {
  return useCache<Data>(cache, endpoint, () =>
    fetch(endpoint).then((res) => res.json()),
  )
}
