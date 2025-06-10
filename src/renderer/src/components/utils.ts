import { TreeItem } from './left/contents/FolderTree'

export const SEP = '\\'
export function getNthOfTreeItems(
  treeItems: TreeItem[] | undefined,
  nth: number,
  curIdx = 0
): [TreeItem | undefined, number] {
  let findTreeItem: TreeItem | undefined
  if (!treeItems) {
    return [findTreeItem, curIdx]
  }
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    curIdx++
    if (curIdx - 1 == nth) {
      findTreeItem = treeItems[idxItem]
      break
    }
    const [findItem, nextIdx] = getNthOfTreeItems(treeItems[idxItem]?.items, nth, curIdx)
    findTreeItem = findItem
    curIdx = nextIdx
    if (findTreeItem) {
      break
    }
  }
  return [findTreeItem, curIdx]
}

export function getCountOfTreeItems(treeItems: TreeItem[] | undefined): number {
  if (!treeItems) {
    return 0
  }
  let count = treeItems.length
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    const treeItem = treeItems[idxItem]
    if (!treeItem.items) {
      continue
    }
    count += getCountOfTreeItems(treeItem.items)
  }
  return count
}
