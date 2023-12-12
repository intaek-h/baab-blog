import { api } from '$lib/utils/fetch'

export const getMe = {
  queryKey: ['me'],
  queryFn: async () => {
    if (!localStorage.getItem('base-token')) return

    const { data } = await api.get('/api/users/me')
    return data
  },
}
