import React, { useState } from 'react';
import x from 'classnames';
import {
  Card, Row, Col, Button, Input,
} from 'antd';
import ParserResovler, { hasCorrespondingParser } from '../../ParserResovler';
import { noop } from '../../../tools';

import './DictParser.less';

const DictParser = React.memo(({
  value,
  onChange,
  extra: {
    parser = noop,
    formatter = noop,
    className = '',
  } = {},
}) => {
  const [nextKey, setNextKey] = useState('');

  const dictList = parser(value);

  const handleChange = (type, index, val) => {
    const nextList = [...dictList];
    const target = [...dictList[index]];
    const modifyKey = type === 'key' ? 0 : 1;
    target[modifyKey] = val;
    nextList[index] = target;

    onChange(formatter(nextList));
  };

  const handleAddDict = () => {
    const nextList = [...dictList];
    nextList.push(['key', 'value']);

    onChange(formatter(nextList));
  };

  const renderItem = (item, index) => {
    const [key, val] = item;
    let addonAfter = null;

    if (hasCorrespondingParser(val)) {
      addonAfter = (
        <span onClick={() => setNextKey(key)}>
          Parse
        </span>
      );
    }
    return (

      <div key={index} className="dict-parser-item">
        <Col offset={1} span={5}>
          <Input
            value={key}
            onChange={(e) => handleChange('key', index, e.target.value)}
          />
        </Col>
        <Col span={1} style={{ justifyContent: 'center' }}>
          <span>→</span>
        </Col>
        <Col span={16} key={key}>
          <Input
            className={x({ parsed: key === nextKey && key !== '' })}
            value={val}
            onChange={(e) => handleChange('value', index, e.target.value)}
            addonAfter={addonAfter}
          />
        </Col>
      </div>
    );
  };

  const findValue = (key) => {
    const ret = dictList.find((item) => item[0] === key);
    if (ret) return ret[1];

    return '';
  };

  const findIndex = (key) => dictList.findIndex((item) => item[0] === key);

  return (
    <div>
      <Card hoverable className={x('dict-parser-wrapper', className)}>
        <Row>
          {dictList.map(renderItem)}
          <Col offset={1} span={23} style={{ textAlign: 'left' }}>
            <Button type="link" onClick={handleAddDict}>添加参数</Button>
          </Col>
        </Row>
      </Card>
      {nextKey && (
      <ParserResovler
        value={findValue(nextKey)}
        onChange={(v) => handleChange('value', findIndex(nextKey), v)}
      />
      )}
    </div>
  );
});

export default DictParser;
