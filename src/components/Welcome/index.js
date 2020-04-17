/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react';
import {
  Input, Affix, Icon, message, List, Popconfirm, Card, Tooltip,
} from 'antd';
import QueueAnim from 'rc-queue-anim';
import { useScroll } from 'react-use';

import { noop } from '../../tools';
import * as db from '../../db';
import { hasCorrespondingParser } from '../ParserResovler';

import './Welcome.less';

const breakChange = (prev, next) => {
  const prevLength = prev.length;
  const nextLength = next.length;
  if (Math.abs(prevLength - nextLength) > 10 && nextLength > 0) {
    return true;
  }

  return false;
};

const computeOpacity = (y) => {
  const height = 150;
  return y > height
    ? 0
    : (height - y) / height;
};

export default ({
  value = '',
  mode = false,
  onChange = noop,
}) => {
  const container = useRef(null);
  const [recents, setRecents] = useState([]);
  const { y } = useScroll(container);

  const updateRecents = async () => {
    const ret = await db.get('base', 'recents');
    setRecents(ret.reverse());
  };

  useEffect(() => {
    if (!mode) {
      updateRecents();
    }
  }, [mode]);

  const handleChange = (val) => {
    onChange(val, breakChange(value, val));
  };

  const handleEdit = () => {
    if (hasCorrespondingParser(value)) {
      onChange(value, true);
    } else {
      message.warn('无法解析当前 URI');
    }
  };

  const handleDelete = (id) => {
    db.get('base', 'recents')
      .then((data) => db.set('base', 'recents', data.filter((i) => i.id !== id)))
      .finally(() => {
        updateRecents();
      });
  };

  const renderRecents = () => (
    <QueueAnim
      type={['right', 'left']}
      duration={[450, 380]}
      leaveReverse
    >
      {recents.map((item) => (
        <Card key={item.id} hoverable>
          <List.Item
            actions={[
              <a href="#" onClick={() => onChange(item.value, true)}>使用</a>,
              <Popconfirm
                title="删除不可恢复，确定吗？"
                onConfirm={() => handleDelete(item.id)}
                okText="确定"
                cancelText="取消"
              >
                <a href="#">删除</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={item.label}
              description={item.value}
            />
          </List.Item>
        </Card>
      ))}
    </QueueAnim>
  );

  return (
    <div className="welcome-container" ref={container}>
      <div className="content">
        <h1 style={{ opacity: computeOpacity(y) }}>URI 生成工具</h1>
        <Affix offsetTop={20} target={() => container.current}>
          <div className="input">
            <Input.TextArea
              placeholder="输入你的 URI 或粘贴至此处"
              value={value}
              autoSize
              onChange={(e) => handleChange(e.target.value)}
            />
            <Tooltip placement="top" title="Shift + Meta + Comma 切换" mouseEnterDelay="0.8">
              <div className="go" onClick={handleEdit}>
                <Icon type="arrow-right" />
              </div>
            </Tooltip>
          </div>
        </Affix>
        {recents.length > 0
        && (
        <List className="recent" header="收藏链接">
          {renderRecents()}
        </List>
        )}
      </div>
    </div>
  );
};
