import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import React, { useEffect, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useFolderTreeRefStore } from '@renderer/store/folderTreeRefStore'
import type { FolderTree } from '@renderer/types'
import {
  fetchFolderTree,
  scrollToItem, selectTreeItem,
  TREE_ITEM_SIZE
} from '@renderer/components/left/contents/tree'
import {
  fetchDisks,
  getNthOfTreeItems,
  getCountOfTreeItems
} from '@renderer/components/left/contents/tree'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  // const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setFolderTreeRef = useFolderTreeRefStore((state) => state.setFolderTreeRef)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)

  const listRef = useRef<List>(null)
  const [absPath, setAbsPath] = useState<string | null>(null)

  useEffect(() => {
    setFolderTreeRef(listRef)
  }, [setFolderTreeRef])

  useEffect(() => {
    window.api.getArgPath().then((p) => {
      if (p) {
        // console.log('argPath:', p)
        setAbsPath(p)
      }
    })
  }, [setAbsPath])

  useEffect(() => {
    if (absPath) {
      fetchFolderTree({ fullPath: absPath }).then(([tree, item]) => {
        if (tree && item) {
          setFolderTree([...tree])
          selectTreeItem({ newItem: item })
          setSelectedItem({ ...item })
          scrollToItem({ selectedItem: item, folderTree: tree, folderTreeRef })
        }
      })
    } else {
      fetchDisks().then((folderTree: FolderTree | undefined) => {
        if (folderTree) {
          setFolderTree([...folderTree])
        } else {
          setFolderTree(undefined)
        }
      })
    }
  }, [absPath, folderTreeRef, setFolderTree, setSelectedItem])
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={TREE_ITEM_SIZE}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => {
            const treeItem = getNthOfTreeItems(folderTree, index)[0]
            return treeItem ? (
              <FolderTreeItem key={`folder-tree-item-${index}`} style={style} treeItem={treeItem} />
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderTree
