import type { CoreEditor } from '$lib/editor/core/editor'
import { writable } from 'svelte/store'

export const title = writable('')

export const editor = writable<CoreEditor | undefined>()
