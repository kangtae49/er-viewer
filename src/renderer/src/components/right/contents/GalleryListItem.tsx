import React, { useEffect, useRef } from 'react'
import { TreeItem } from '@renderer/types'

type GalleryListItemProp = {
  style: React.CSSProperties
  rowTreeItems: TreeItem[]
  sliderPos: { x: number; y: number }
}
function GalleryListItem({
  rowTreeItems,
  style,
  sliderPos
}: GalleryListItemProp): React.ReactElement {
  // console.log(rowTreeItems)
  return (
    <div className="item" style={style}>
      {rowTreeItems.map((item, idx) => {
        const sz = item?.sz || 0
        if (!item) {
          return <ViewNone key={idx} sliderPos={sliderPos} />
        } else if (item.mt?.startsWith('image/')) {
          return <ViewImg key={idx} sliderPos={sliderPos} item={item} />
        } else if (item.mt?.startsWith('video/') && sz > 1024 * 500) {
          return <ViewVideo key={idx} sliderPos={sliderPos} item={item} />
        } else if (item.mt?.startsWith('audio/') && sz > 1024 * 500) {
          return <ViewAudio key={idx} sliderPos={sliderPos} item={item} />
        } else {
          return <ViewNm key={idx} sliderPos={sliderPos} item={item} />
        }
      })}
    </div>
  )
}

interface FileViewProps {
  item?: TreeItem
  sliderPos: { x: number; y: number }
}

function ViewNm({ item, sliderPos }: FileViewProps): React.ReactElement {
  return (
    <div className="col view-nm" style={{ width: sliderPos.x, height: sliderPos.y }}>
      {item?.nm}
    </div>
  )
}

function ViewNone({ sliderPos }: FileViewProps): React.ReactElement {
  return <div className="col view-none" style={{ width: sliderPos.x, height: sliderPos.y }}></div>
}

function ViewImg({ item, sliderPos }: FileViewProps): React.ReactElement {
  return (
    <div className="col view-img" style={{ width: sliderPos.x, height: sliderPos.y }}>
      <img src={item?.full_path} alt={item?.full_path} loading="lazy" />
    </div>
  )
}

function ViewAudio({ item, sliderPos }: FileViewProps): React.ReactElement {
  const mediaRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div className="col view-audio" style={{ width: sliderPos.x, height: sliderPos.y }}>
      <audio ref={mediaRef} controls={true} autoPlay={false}>
        <source src={item?.full_path} type={item?.mt} />
      </audio>
    </div>
  )
}

function ViewVideo({ item, sliderPos }: FileViewProps): React.ReactElement {
  const mediaRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div className="col view-video" style={{ width: sliderPos.x, height: sliderPos.y }}>
      <video ref={mediaRef} controls={true} autoPlay={false}>
        <source src={item?.full_path} type={item?.mt} />
      </video>
    </div>
  )
}

export default GalleryListItem
