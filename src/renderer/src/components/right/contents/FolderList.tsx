import React, { useEffect, useState } from 'react'
import FolderListItem from '@renderer/components/right/contents/FolderListItem'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { LIST_ITEM_SIZE } from '@renderer/components/left/contents/tree'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import { fetchTreeItems } from '@renderer/components/left/contents/tree'
import { TreeItem } from '@renderer/types'

function FolderList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const [listItems, setListItems] = useState<TreeItem[] | undefined>(undefined)
  useEffect(() => {
    fetchTreeItems(selectedItem, false).then((fetchItems) => setListItems(fetchItems))
  }, [selectedItem])
  return (
    <>
      {listItems && (
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="folder-list"
              height={height}
              itemCount={listItems?.length || 0}
              itemSize={LIST_ITEM_SIZE}
              width={width}
            >
              {({ index, style }) => {
                const listItem = listItems[index]
                return listItem ? (
                  <FolderListItem
                    key={`folder-list-item-${index}`}
                    style={style}
                    treeItem={listItem}
                  />
                ) : null
              }}
          </List>
          )}
        </AutoSizer>
      )}
    </>
  )
}

export default FolderList
