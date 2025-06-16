import React from 'react'
import MainPane from '@renderer/components/MainPane'


function App(): React.JSX.Element {
  return (
    <>
      <MainPane />
    </>
  )
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'F12') {
    window.electron?.ipcRenderer.send('open-devtools')
  }
})
export default App
