import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import { DiskInfo, Item } from 'napi-bindings'
import { useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { getNthOfTreeItems, getCountOfTreeItems, SEP } from '@renderer/components/utils'

export type TreeItem = {
  nm: string
  dir: boolean
  full_path: string
  items: TreeItem[] | null
}

const fromDisk = (disk: DiskInfo): TreeItem => {
  return {
    nm: disk.path.replaceAll(SEP, ''),
    full_path: disk.path,
    dir: true,
    items: null
  }
}

const fromItem = (item: Item, basePath: string): TreeItem => {
  const fullPath = basePath.endsWith(SEP)
    ? [basePath, item.nm].join('')
    : [basePath, item.nm].join(SEP)
  return {
    nm: item.nm.replaceAll(SEP, ''),
    full_path: fullPath,
    dir: item.dir,
    items: null
  }
}

function FolderTree(): React.ReactElement {
  const [items, setTreeItems] = useState<TreeItem[] | null>(null)
  const clickIcon = async (treeItem: TreeItem): Promise<void> => {
    if (items && treeItem.dir) {
      if (treeItem.items == null) {
        const folder = await window.api.readFolder({ path_str: treeItem.full_path })
        const folderItems = folder?.item?.items
        if (folderItems) {
          treeItem.items = folderItems.map((folderItem) => {
            const basePath = [folder.base_nm, folder.item.nm].join(SEP)
            return fromItem(folderItem, basePath)
          })
        } else {
          treeItem.items = null
        }
      } else {
        treeItem.items = null
      }
      setTreeItems([...items])
    }
  }

  const clickLabel = (item: TreeItem): void => {
    console.log(item)
  }

  const itemSize = 18

  useEffect(() => {
    window.api.getDisks().then((disks: DiskInfo[]) => {
      setTreeItems(disks.map(fromDisk))
    })
  }, [])
  // console.log('getNthOfTreeItems: ', getNthOfTreeItems(items, 0))
  // const sample: TreeItem[] = [
  //   {nm: '', dir: true, full_path: '', items: [
  //       {nm: '', dir: true, full_path: '', items: []},
  //       {nm: '', dir: true, full_path: '', items: []},
  //       {nm: '', dir: true, full_path: '', items: []},]},
  //   {nm: '', dir: true, full_path: '', items: []},
  // ]
  // console.log('getCountOfTreeItems: ', getCountOfTreeItems(sample))
  console.log('count: ', getCountOfTreeItems(items) || 0)
  console.log('items', items)
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(items) || 0}
          itemSize={itemSize}
          width={width}
        >
          {({ index, style }) => {
            const item = getNthOfTreeItems(items, index)[0]
            return item ? (
              <FolderTreeItem
                key={index}
                style={style}
                item={item}
                clickIcon={clickIcon}
                clickLabel={clickLabel}
              />
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderTree
