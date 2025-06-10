import { create } from 'zustand'
import { TreeItem } from '@renderer/components/left/contents/FolderTree'

interface FolderTreeStore {
  folderTree?: TreeItem[]
  setFolderTree: (folderTree?: TreeItem[]) => void
}

export const useFolderTreeStore = create<FolderTreeStore>((set) => ({
  folderTree: undefined,
  setFolderTree: (folderTree?: TreeItem[]) =>
    set(() => ({
      folderTree: folderTree
    }))
}))
