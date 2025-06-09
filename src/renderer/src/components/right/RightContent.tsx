import FolderList from '@renderer/components/right/contents/FolderList'
import GalleryList from '@renderer/components/right/contents/GalleryList'

type ContentType = 'FileText' | 'FolderList' | 'GalleryList'

function getContentType(): ContentType {
  return 'FolderList'
}
function RightContent(): React.ReactNode {
  const contentType: ContentType = getContentType()
  return (
    <div className="content">
      {(() => {
        switch (contentType) {
          case 'FileText':
            return <FolderList />
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
