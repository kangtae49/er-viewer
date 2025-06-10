import { create } from 'zustand'

export type DirectoryViewType = 'FolderList' | 'GalleryList'

interface DirectoryViewTypeStore {
  directoryViewType: DirectoryViewType
  setDirectoryViewType: (directoryViewType: DirectoryViewType) => void
}

export const useDirectoryViewTypeStore = create<DirectoryViewTypeStore>((set) => ({
  directoryViewType: 'FolderList',
  setDirectoryViewType: (directoryViewType: DirectoryViewType) =>
    set(() => ({
      directoryViewType: directoryViewType
    }))
}))
