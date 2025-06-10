import '@assets/main-pane.css'

import LeftPane from '@renderer/components/left/LeftPane'
import RightPane from '@renderer/components/right/RightPane'
import { SplitPane } from '@rexxars/react-split-pane'
import React from 'react'

function MainPane(): React.JSX.Element {

  return (
    <div className="main-pane">
      <SplitPane split="vertical" minSize={0} defaultSize={200}>
        <LeftPane />
        <RightPane />
      </SplitPane>
    </div>
  )
}

export default MainPane
