import React, { useState, useEffect } from 'react'
import { useKeyPress, useKey } from 'react-use'
import qs from 'querystring'
import x from 'classnames'
import { Icon, message } from 'antd'
import ParserResolver, { hasCorrespondingParser } from '../ParserResolver'
import UsePanel from '../UsePanel'
import Welcome from '../Welcome'
import './App.less'

function App() {
  const [uri, setURI] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [shiftKeyPressed] = useKeyPress('Shift')
  const [metaKeyPressed] = useKeyPress('Meta')

  useKey(',', () => {
    if (shiftKeyPressed && metaKeyPressed) {
      if (hasCorrespondingParser(uri)) {
        setEditMode(!editMode)
      } else {
        message.warn('Unable to resolve current URI')
      }
    }
  }, {}, [shiftKeyPressed, metaKeyPressed, editMode])

  const editModeClass = editMode ? '' : 'init'

  const handleChange = (val, breakChange) => {
    setURI(val)
    if (breakChange) {
      setEditMode(true)
    }
  }

  useEffect(() => {
    const params = qs.parse(window.location.search.slice(1))
    if (params.url) {
      setURI(params.url)
      setEditMode(true)
    }
  }, [])

  return (
    <div className="app-container">
      <Welcome value={uri} onChange={handleChange} mode={editMode} />
      <main className={editModeClass}>
        <ParserResolver value={uri} onChange={setURI} />
      </main>
      <aside className={editModeClass}>
        <UsePanel href={uri} />
      </aside>
      <div className={x('exit-editor-action', { init: !editMode })} onClick={() => setEditMode(false)}>
        <Icon type="api" />
      </div>
    </div>
  )
}

export default App
