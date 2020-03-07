import React, { useState, useEffect } from 'react';
import x from 'classnames';
import { Card } from 'antd';
import MonacoEditor from 'react-monaco-editor';

import { safeParseJSON, formatReadableJSON } from '../../../tools';

import './JSONParser.less';

const settings = {
  selectOnLineNumbers: true,
  minimap: { enabled: false },
  language: 'json',
};

const JSONParser = ({ value, onChange }) => {
  const [cache, setCache] = useState(formatReadableJSON(value));

  const handleChange = (val) => {
    const nextJSON = safeParseJSON(val);
    if (nextJSON) {
      onChange(JSON.stringify(nextJSON));
    } else {
      setCache(val);
    }
  };

  useEffect(() => {
    setCache(formatReadableJSON(value));
  }, [value]);

  return (
    <div>
      <Card hoverable className={x('json-parser-wrapper')}>
        <MonacoEditor
          height="400"
          language=""
          theme="vs"
          value={cache}
          options={settings}
          onChange={(v) => handleChange(v)}
        />
      </Card>
    </div>
  );
};

export default JSONParser;
