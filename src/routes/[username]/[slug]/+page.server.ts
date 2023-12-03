import { api } from '$lib/utils/fetch'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { username, slug } = params

    const queries = [
      `filters[username][$eq]=${username.slice(1)}`,
      `populate[articles][filters][slug][$eq]=${slug}`,
    ].join('&')

    const response = await api.get(`/api/users?${queries}`)

    return {
      article: response.data[0],
    }
  } catch (error) {
    return { article: null }
  }
}
