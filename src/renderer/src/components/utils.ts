import { TreeItem } from './left/contents/FolderTree'

export const SEP = '\\'
export function getNthOfTreeItems(
  items: TreeItem[] | null,
  nth: number,
  curIdx = 0
): [TreeItem | null, number] {
  let item: TreeItem | null = null
  if (items == null) {
    return [item, curIdx]
  }
  for (let idxItem = 0; idxItem < items.length; idxItem++) {
    curIdx++
    if (curIdx - 1 == nth) {
      item = items[idxItem]
      break
    }
    const [findItem, nextIdx] = getNthOfTreeItems(items[idxItem].items, nth, curIdx)
    item = findItem
    curIdx = nextIdx
    if (item != null) {
      break
    }
  }
  return [item, curIdx]
}

export function getCountOfTreeItems(items: TreeItem[] | null): number {
  if (items == null) {
    return 0
  }
  let count = items.length
  for (let idxItem = 0; idxItem < items.length; idxItem++) {
    const item = items[idxItem]
    if (item.items == null) {
      continue
    }
    count += getCountOfTreeItems(item.items)
  }
  return count
}
