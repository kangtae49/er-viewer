import FolderListItem from '@renderer/components/right/contents/FolderListItem'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

function FolderList(): React.ReactElement {
  const itemSize = 24
  const itemCount = 1000
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-list"
          height={height}
          itemCount={itemCount}
          itemSize={itemSize}
          width={width}
        >
          {({ index, style }) => <FolderListItem key={index} style={style} />}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderList
