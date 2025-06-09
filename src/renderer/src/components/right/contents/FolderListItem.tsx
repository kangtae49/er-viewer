type FolderListItemProps = {
  style: React.CSSProperties
}

function FolderListItem({ style }: FolderListItemProps): React.ReactElement {
  return (
    <div className="item" style={style}>
      <div className="nm">파일명 파일명 파일명 파일명 파일명 파일명 파일명 파일명.txt</div>
      <div className="sz">123,456K</div>
      <div className="ext">txt</div>
      <div className="tm">2025-06-08 00:00:00</div>
    </div>
  )
}

export default FolderListItem
