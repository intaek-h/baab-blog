import { browser } from '$app/environment'
import { api } from '$lib/utils/fetch'

export const getMe = {
  queryKey: ['me'],
  queryFn: async () => {
    if (!browser) return

    const { data } = await api.get('/api/users/me')
    return data
  },
}
