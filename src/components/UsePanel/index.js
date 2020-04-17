import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import copy from 'copy-to-clipboard';
import {
  Input, Button, message, Modal,
} from 'antd';
import qrcode from 'qrcode';

import * as db from '../../db';
import { genUUID } from '../../tools';

import './UsePanel.less';

export default ({
  href = '',
}) => {
  const [imageData, setImageData] = useState('');
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');

  useDebounce(() => {
    qrcode.toDataURL(href || 'Paste URL first', { margin: 2 })
      .then((url) => setImageData(url))
      .catch((err) => console.log(err));
  }, 500, [href]);

  useEffect(() => {
    if (!visible) setLabel('');
  }, [visible]);

  const handleSave = () => {
    if (label.trim() === '') {
      message.warn('链接描述不可为空哦，给它起个名字吧！');
    } else {
      db.get('base', 'recents')
        .then((recents = []) => db.set('base', 'recents', recents.concat({
          label,
          value: href,
          id: genUUID(),
        })))
        .finally(() => {
          message.success(`已保存：${label}`);
          setVisible(false);
        });
    }
  };

  const handleCopy = () => {
    copy(href);
    message.success('已复制');
  };

  return (
    <div className="use-panel-wrapper">
      <img className="qrcode" src={imageData} alt="" />
      <Input.TextArea
        value={href}
        autoSize={{
          maxRows: 4,
        }}
      />
      <Button
        type="link"
        icon="save-fill"
        onClick={() => setVisible(true)}
      >
        保存链接
      </Button>
      <Button
        type="link"
        icon="copy"
        onClick={handleCopy}
      >
        复制链接
      </Button>
      <Modal
        title="保存链接"
        visible={visible}
        onOk={handleSave}
        onCancel={() => setVisible(false)}
      >
        <div className="link-desc">{href}</div>
        <Input
          autoFocus
          required
          placeholder="输入链接简要描述，方便记忆"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Modal>
    </div>
  );
};
