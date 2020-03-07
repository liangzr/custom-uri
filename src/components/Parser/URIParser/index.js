import React, { useState } from 'react';
import {
  Row, Col, Input, Card,
} from 'antd';
import {
  parseURI, formatURI,
} from '../../../tools';
import ParserResovler from '../../ParserResovler';

import './URIParser.less';

const URI = React.memo(({ value, onChange }) => {
  const [nextKey, setNextKey] = useState('');
  const uri = parseURI(value);

  const handleChange = (key, val) => {
    const nextURI = { ...uri };
    nextURI[key] = val;
    if (key === 'protocol' && val === '') {
      nextURI.host = '';
    }
    onChange(formatURI(nextURI));
  };

  const renderItem = (key, val) => {
    const isHostKey = key === 'host';
    const isAuthKey = key === 'auth';
    const isSearchKey = key === 'query';
    const isHashKey = key === 'hash';
    const hasProtocol = !!uri.protocol;
    const hasHost = !!uri.host;

    let span = 9;
    let addonAfter = null;
    let placeholder = '';
    const disabled = (isHostKey || isAuthKey) && !hasProtocol;

    if (disabled) {
      placeholder = 'protocol 不可为空';
    } else if (!hasHost && isAuthKey) {
      placeholder = 'host 不可为空';
    }

    if (isSearchKey || isHashKey) {
      span = 21;
    }

    if (isSearchKey) {
      addonAfter = (
        <span onClick={() => setNextKey(key)}>
          Parse
        </span>
      );
    }

    return (
      <div key={key} className="uri-parser-item">
        <Col span={3}>
          <label htmlFor="123" style={{}}>{key}：</label>
        </Col>
        <Col span={span} key={key}>
          <Input
            className={key === nextKey ? 'parsed' : null}
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
            addonAfter={addonAfter}
            disabled={disabled}
            placeholder={placeholder}
          />
        </Col>
      </div>
    );
  };

  return (
    <div>
      <Card hoverable className="uri-parser-wrapper">
        <Row>
          {Object.keys(uri).map((key) => renderItem(key, uri[key]))}
        </Row>
      </Card>
      {nextKey && (
      <ParserResovler value={uri[nextKey]} onChange={(v) => handleChange(nextKey, v)} />
      )}
    </div>
  );
});

export default URI;
