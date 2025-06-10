import { create } from 'zustand'
import { TreeItem } from '@renderer/components/left/contents/FolderTree'

interface SelectedTreeItemStore {
  selectedItem?: TreeItem
  setSelectedItem: (treeItem?: TreeItem) => void
}

export const useSelectedTreeItemStore = create<SelectedTreeItemStore>((set) => ({
  selectedItem: undefined,
  setSelectedItem: (treeItem?: TreeItem) =>
    set(() => ({
      selectedItem: treeItem
    }))
}))
