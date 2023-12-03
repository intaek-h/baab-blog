import type { PageServerLoad } from './$types'
import { api } from '$lib/utils/fetch'

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.username

  if (!slug || !slug.startsWith('@')) {
    return {
      user: null,
    }
  }

  const userName = slug.slice(1)
  const queries = [
    `filters[username][$eq]=${userName}`,
    'populate[articles][fields][0]=title',
    'populate[articles][fields][1]=preview',
    'populate[articles][fields][2]=createdAt',
    'populate[articles][fields][3]=slug',
  ].join('&')

  const url = `/api/users?${queries}`

  const res = await api.get(url)

  return {
    user: res.data as any[],
  }
}
