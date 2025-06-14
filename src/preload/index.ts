import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import path from 'node:path'
import type { Folder, OptParams, TextContent, HomeType, DiskInfo } from 'napi-bindings'

const isDev = process.env.NODE_ENV === 'development'
console.log(`isDev: ${isDev}`)

const nativePath = isDev
  ? path.join(__dirname, '../../napi-folder')
  : path.join(process.resourcesPath, 'napi-folder')

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FolderApi } = require(nativePath)

export type HomePathMap = Record<HomeType, string>

export interface FolderAPI {
  getCurPath: () => Promise<string>
  readFolder: (params: OptParams) => Promise<Folder>
  readTextFile: (pathStr: string) => Promise<TextContent>
  setState: <T>(key: string, val: T) => Promise<T>
  getState: <T>(key: string, default_val: object | undefined) => Promise<T>
  getHomeDir: () => Promise<HomePathMap>
  getDisks: () => Promise<DiskInfo[]>
  shellOpenPath: (path: string | undefined) => Promise<string>
  shellOpenExternal: (path: string | undefined) => Promise<void>
  shellShowItemInFolder: (path: string | undefined) => void
}

// Custom APIs for renderer
const api: FolderAPI = {
  getCurPath: async (): Promise<string> => {
    return await ipcRenderer.invoke('get-cur-path')
  },
  readFolder: async (params: OptParams): Promise<Folder> => {
    return new FolderApi().readFolder(JSON.stringify(params)).then(JSON.parse)
  },
  readTextFile: async (pathStr: string): Promise<TextContent> => {
    return new FolderApi().readText(pathStr).then(JSON.parse)
  },
  setState: async <T>(key: string, val: T): Promise<T> => {
    let str_val: string | T
    if (val !== null && typeof val === 'object') {
      str_val = JSON.stringify(val)
    } else {
      str_val = val
    }

    const new_val = await new FolderApi().setState(key, str_val)
    if (val !== null && typeof val === 'object') {
      return JSON.parse(new_val)
    } else {
      return new_val
    }
  },
  getState: async <T>(key: string, default_val: object | undefined): Promise<T> => {
    let obj_default_val: string | undefined = undefined
    if (default_val != null && typeof default_val === 'object') {
      obj_default_val = JSON.stringify(default_val)
    }
    return new FolderApi().getState(key, obj_default_val).then(JSON.parse)
  },
  getHomeDir: async (): Promise<HomePathMap> => {
    return new FolderApi().getHomeDir().then(JSON.parse)
  },
  getDisks: async (): Promise<DiskInfo[]> => {
    return new FolderApi().getDisks().then(JSON.parse)
  },
  shellOpenPath: async (path: string | undefined): Promise<string> => {
    if (path) {
      return shell.openPath(path)
    }
    return ''
  },
  shellOpenExternal: async (path: string | undefined): Promise<void> => {
    if (path) {
      return shell.openExternal(path)
    }
  },
  shellShowItemInFolder: (path: string | undefined): void => {
    if (path) {
      return shell.showItemInFolder(path)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
