import type { CoreEditor } from '$lib/editor/core/editor'
import { writable } from 'svelte/store'

export const editor = writable<CoreEditor | undefined>()

export const title = writable<string>('')
