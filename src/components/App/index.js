import React, { useState } from 'react';
import { useKeyPress, useKey } from 'react-use';
import x from 'classnames';
import { Icon } from 'antd';
import ParserResovler from '../ParserResovler';
import UsePanel from '../UsePanel';
import Welcome from '../Welcome';
import './App.less';

function App() {
  const [uri, setURI] = useState('http://market.wapa.taobao.com/app/dinamic/h5-tb-order/index.html?ttid=eleme%40eleme_android_8.12.2&buildOrderVersion=3.0&isCallTradepay=true&quantity=1&itemId=612186737037&buyNow=true&exParams=%7B%22alscItemExt%22%3A%7B%22channelKey%22%3A%22ALL%22%2C%22cityId%22%3A%22310100%22%2C%22storeId%22%3A%22281142013%22%2C%22sourceFrom%22%3A%22itemdetail%22%2C%22isCallTradepay%22%3Atrue%7D%7D');
  const [editMode, setEditMode] = useState(true);
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
      <div className={x('exit-editor-action', { init: !editMode })} onClick={() => setEditMode(false)}>
        <Icon type="api" />
      </div>
    </div>
  );
}

export default App;
