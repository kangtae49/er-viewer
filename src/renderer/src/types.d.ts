import type { HomeType } from 'napi-bindings'

export type HomePathMap = Record<HomeType, string>
export type FolderTree = TreeItem[]
export type TreeItem = {
  parent?: TreeItem
  nm: string
  full_path: string
  dir?: boolean
  ext?: string
  mt?: string
  sz?: number
  tm?: number
  items?: TreeItem[]
  selected?: boolean
}
export type DirectoryViewType = 'FolderList' | 'GalleryList'

export type FolderListOrder = {
  key: FolderListOrderKey
  val: FolderListOrderVal
}
export type FolderListOrderKey = 'Nm' | 'Ext' | 'Tm' | 'Sz'
export type FolderListOrderVal = 'Asc' | 'Desc'
