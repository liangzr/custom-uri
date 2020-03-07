import React, { useState, useRef, useEffect } from 'react';
import { Input, Typography } from 'antd';
import x from 'classnames';
import { useScroll } from 'react-use';
import ParserResovler from '../ParserResovler';
import UsePanel from '../UsePanel';
import './App.less';

function usePrevious(lazyed) {
  const ref = useRef();
  useEffect(() => {
    ref.current = lazyed.value;
  });
  return ref.current;
}

function App() {
  const [uri, setURI] = useState('');
  const parserTree = useRef(null);
  const { y: position } = useScroll(parserTree);

  const hasScrolled = position > 0;

  const layzed = {};
  const slimemd = usePrevious(layzed);
  const showSlim = slimemd
    ? position > 0
    : position > 200;
  layzed.value = showSlim;

  const headerClass = x('header', {
    slim: showSlim,
    cover: hasScrolled,
  });

  return (
    <div className="app-container">
      <main>
        <div className={headerClass}>
          <Typography.Title level={3}>URI 生成工具</Typography.Title>
          <Input.TextArea
            placeholder="请输入内容"
            style={{
              height: showSlim ? 31 : 94,
            }}
            value={uri}
            onChange={(e) => setURI(e.target.value)}
          />
        </div>
        <div className="parser-tree-wrapper" ref={parserTree}>
          <ParserResovler value={uri} onChange={setURI} />
        </div>
      </main>
      <aside>
        <UsePanel href={uri} />
      </aside>
    </div>
  );
}

export default App;
