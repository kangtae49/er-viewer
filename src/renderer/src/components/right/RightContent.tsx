import React from 'react'
import FolderList from '@renderer/components/right/contents/FolderList'
import GalleryList from '@renderer/components/right/contents/GalleryList'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import {
  DirectoryViewType,
  useDirectoryViewTypeStore
} from '@renderer/store/directoryViewTypeStore'
import FileView from '@renderer/components/right/contents/FileView'

type ContentType = 'FileText' | DirectoryViewType

function RightContent(): React.ReactNode {
  let contentType: ContentType = 'FileText'
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const directoryViewTypeStore = useDirectoryViewTypeStore((state) => state.directoryViewType)
  if (!selectedItem?.dir) {
    contentType = 'FileText'
  } else if (selectedItem?.dir) {
    contentType = directoryViewTypeStore
  }
  return (
    <div className="content">
      {(() => {
        switch (contentType) {
          case 'FileText':
            return <FileView selectedItem={selectedItem} />
          case 'FolderList':
            return <FolderList />
          case 'GalleryList':
            return <GalleryList />
          default:
            return null
        }
      })()}
    </div>
  )
}

export default RightContent
