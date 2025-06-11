import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import React, { useEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import type { FolderTree, TreeItem } from '@renderer/types'
import {
  fetchDisks,
  fetchTreeItems,
  getNthOfTreeItems,
  getCountOfTreeItems
} from '@renderer/components/left/contents/tree'

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)

  const clickIcon = async (treeItem?: TreeItem): Promise<void> => {
    console.log('click', treeItem)
    if (folderTree && treeItem?.dir) {
      if (!treeItem.items) {
        const treeItems = await fetchTreeItems(treeItem)
        if (!treeItems) {
          delete treeItem.items
        }
      } else {
        delete treeItem.items
      }
      setFolderTree([...folderTree])
    }
  }

  const clickLabel = (treeItem?: TreeItem): void => {
    console.log(treeItem)
    selectTreeItem(treeItem)
  }

  const selectTreeItem = (treeItem?: TreeItem): void => {
    if (!treeItem) {
      return
    }
    if (selectedItem) {
      delete selectedItem.selected
    }
    treeItem.selected = true
    setSelectedItem(treeItem)
  }

  const itemSize = 18

  useEffect(() => {
    fetchDisks().then((folderTree: FolderTree | undefined) => {
      setFolderTree(folderTree)
    })
  }, [setFolderTree])
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={itemSize}
          width={width}
        >
          {({ index, style }) => {
            const treeItem = getNthOfTreeItems(folderTree, index)[0]
            return treeItem ? (
              <FolderTreeItem
                key={index}
                style={style}
                treeItem={treeItem}
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
