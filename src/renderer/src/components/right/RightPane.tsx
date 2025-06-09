import '@assets/right/right-pane.css'
import RightTop from '@renderer/components/right/RightTop'
import RightContent from '@renderer/components/right/RightContent'

function RightPane(): React.JSX.Element {
  return (
    <div className="right-pane">
      <RightTop />
      <RightContent />
    </div>
  )
}

export default RightPane
