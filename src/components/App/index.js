import React, { useState, useEffect, useCallback } from 'react'
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

  const beforeSwitchMode = useCallback((next) => {
    if (hasCorrespondingParser(next)) return true

    message.warn('Unable to resolve current URI')
    return false
  }, [])

  useKey(',', () => {
    if (shiftKeyPressed && metaKeyPressed && beforeSwitchMode(uri)) {
      setEditMode(!editMode)
    }
  }, {}, [shiftKeyPressed, metaKeyPressed, editMode])

  const editModeClass = editMode ? '' : 'init'

  const handleChange = useCallback((val, breakChange) => {
    setURI(val)
    if (breakChange) {
      setEditMode(true)
    }
  }, [])

  useEffect(() => {
    const params = qs.parse(window.location.search.slice(1))
    if (params.url) {
      setURI(params.url)
      if (beforeSwitchMode(params.url)) {
        setEditMode(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (uri) {
      window.history.replaceState(null, '', `/?url=${encodeURIComponent(uri)}`)
    } else {
      window.history.replaceState(null, '', '/')
    }
  }, [uri])

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
