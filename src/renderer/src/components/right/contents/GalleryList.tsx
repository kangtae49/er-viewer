import React, { useEffect, useState } from 'react'
import FolderListHead from '@renderer/components/right/contents/FolderListHead'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import {
  fetchTreeItems,
  LIST_HEAD_SIZE,
  SLIDER_SIZE
} from '@renderer/components/left/contents/tree'
import GalleryListItem from '@renderer/components/right/contents/GalleryListItem'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import { useFolderListOrderStore } from '@renderer/store/folderListOrderStore'
import { useFolderListStore } from '@renderer/store/folderListStore'

function GalleryList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const folderListOrder = useFolderListOrderStore((state) => state.folderListOrder)
  const folderList = useFolderListStore((state) => state.folderList)
  const setFolderList = useFolderListStore((state) => state.setFolderList)

  const [sliderPos, setSliderPos] = useState<{ x: number; y: number }>({ x: 32, y: 32 })
  // const [sliderY, setSliderY] = useState<number>(32)
  const onChangeSliderX = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const x = Number(event.target.value)
    console.log('sliderX', x)
    const newPos = { x: x, y: sliderPos.y }
    if (newPos != sliderPos) {
      setSliderPos(newPos)
    }
  }
  const onChangeSliderY = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const y = Number(event.target.value)
    console.log('sliderY', y)
    const newPos = { y: y, x: sliderPos.x }
    if (newPos != sliderPos) {
      setSliderPos(newPos)
    }
  }
  useEffect(() => {
    fetchTreeItems({ treeItem: selectedItem, appendChildItems: false, folderListOrder }).then(
      (fetchItems) => setFolderList(fetchItems)
    )
  }, [folderListOrder, selectedItem, setFolderList])
  console.log(sliderPos)
  return (
    <>
      <FolderListHead />
      <AutoSizer>
        {({ height, width }) => {
          const countPerRow = Math.floor(width / sliderPos.x)
          const countY = Math.ceil((folderList?.length || 0) / countPerRow)
          console.log(
            'length',
            folderList?.length,
            'width',
            width,
            'sliderPos',
            sliderPos,
            'countY',
            countY,
            'countPerRow',
            countPerRow
          )
          return (
            <>
              <div className="slider-top">
                <div className="slider-chk">
                  <input type="checkbox" />
                </div>
                <div className="slider-w">
                  <input
                    type="range"
                    name="slider"
                    step={32}
                    min={0}
                    max={width - SLIDER_SIZE}
                    style={{ width: width - SLIDER_SIZE }}
                    value={sliderPos.x}
                    onChange={onChangeSliderX}
                  />
                </div>
              </div>
              <div
                className="slider-left"
                style={{
                  width: width,
                  height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                }}
              >
                <div
                  className="slider-h"
                  style={{
                    width: SLIDER_SIZE,
                    height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                  }}
                >
                  <input
                    type="range"
                    name="slider"
                    step={32}
                    min={0}
                    max={height - LIST_HEAD_SIZE - SLIDER_SIZE}
                    style={{
                      height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                    }}
                    value={sliderPos.y}
                    onChange={onChangeSliderY}
                  />
                </div>
                <List
                  className="folder-gallery"
                  height={height - LIST_HEAD_SIZE - SLIDER_SIZE}
                  itemCount={countY}
                  itemSize={sliderPos.y}
                  width={width}
                >
                  {({ index, style }) => {
                    const rowTreeItems = (folderList || []).slice(
                      index * countPerRow,
                      index * countPerRow + countPerRow
                    )
                    if (rowTreeItems.length < countPerRow) {
                      rowTreeItems.push(...Array(countPerRow - rowTreeItems.length).fill(undefined))
                    }
                    return rowTreeItems ? (
                      <GalleryListItem
                        key={`gallery-list-item-${index}`}
                        style={style}
                        rowTreeItems={rowTreeItems}
                      />
                    ) : null
                  }}
                </List>
              </div>
            </>
          )
        }}
      </AutoSizer>
    </>
  )
}

export default GalleryList
