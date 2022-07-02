import { cache } from './cache'
import { useCache } from '@matthamlin/simple-cache/client'

export function useData<Data>(endpoint: string) {
  return useCache<Data>(cache, endpoint, () =>
    fetch(endpoint).then((data) => data.json()),
  )
}
