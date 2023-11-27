import { writable } from 'svelte/store'

export const me = writable({
  id: 0,
  name: '',
  email: '',
  provider: '',
  confirmed: false,
  blocked: false,
  createdAt: '',
  updatedAt: '',
})
