import React, { useEffect, useState } from 'react'
import FolderListItem from '@renderer/components/right/contents/FolderListItem'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { LIST_ITEM_SIZE } from '@renderer/components/left/contents/tree'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import { fetchTreeItems } from '@renderer/components/left/contents/tree'
import { TreeItem } from '@renderer/types'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCircleChevronUp, faCircleChevronDown, faCircleMinus } from '@fortawesome/free-solid-svg-icons'

function FolderList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const [listItems, setListItems] = useState<TreeItem[] | undefined>(undefined)
  useEffect(() => {
    fetchTreeItems(selectedItem, false).then((fetchItems) => setListItems(fetchItems))
  }, [selectedItem])
  return (
    <>
      {listItems && (
        <>
          <div className="folder-head">
            <div className="nm"><Icon icon={faCircleChevronUp}/>name</div>
            <div className="sz"><Icon icon={faCircleChevronUp}/>size</div>
            <div className="ext"><Icon icon={faCircleChevronDown}/>ext</div>
            <div className="tm"><Icon icon={faCircleMinus}/>date</div>
          </div>

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
        </>
      )}
    </>
  )
}

export default FolderList
