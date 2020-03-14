import React, { useState } from 'react';
import { useKeyPress, useKey } from 'react-use';
import ParserResovler from '../ParserResovler';
import UsePanel from '../UsePanel';
import Welcome from '../Welcome';
import './App.less';

function App() {
  const [uri, setURI] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [shiftKeyPressed] = useKeyPress('Shift');
  const [metaKeyPressed] = useKeyPress('Meta');
  useKey(',', () => {
    if (shiftKeyPressed && metaKeyPressed) {
      setEditMode(!editMode);
    }
  }, {}, [shiftKeyPressed, metaKeyPressed, editMode]);

  const editModeClass = editMode ? '' : 'init';

  const handleChange = (val, breakChange) => {
    setURI(val);
    if (breakChange) {
      setEditMode(true);
    }
  };

  return (
    <div className="app-container">
      <Welcome value={uri} onChange={handleChange} mode={editMode} />
      <main className={editModeClass}>
        <ParserResovler value={uri} onChange={setURI} />
      </main>
      <aside className={editModeClass}>
        <UsePanel href={uri} />
      </aside>
    </div>
  );
}

export default App;
