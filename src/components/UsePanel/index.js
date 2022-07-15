import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import copy from 'copy-to-clipboard';
import {
  Input, Button, message,
} from 'antd';
import qrcode from 'qrcode';

import FavoriteDialog from '../Dialog/FavoriteDialog';
import * as db from '../../db';
import { genUUID } from '../../tools';

import './UsePanel.less';

export default ({
  href = '',
}) => {
  const [imageData, setImageData] = useState('');

  useDebounce(() => {
    qrcode.toDataURL(href || 'Paste URL first', { margin: 2 })
      .then((url) => setImageData(url))
      .catch((err) => console.log(err));
  }, 500, [href]);

  const handleCopy = () => {
    copy(href);
    message.success('Copied!');
  };

  const handleSave = () => {
    const validator = (val) => {
      if (val.length < 1) {
        message.warn('Tags cannot be empty');
        return false;
      }
      return true;
    };

    FavoriteDialog.show(
      {
        title: 'Save URI',
        value: [],
        href,
      },
      (val) => {
        db.get('base', 'recents')
          .then((recents = []) => db.set(
            'base',
            'recents',
            recents.concat({
              tags: val,
              value: href,
              id: genUUID(),
            }),
          ))
          .finally(() => {
            message.success('Saved!');
          });
      },
      validator,
    );
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
      <Button type="link" icon="save-fill" onClick={handleSave}>
        Save URI
      </Button>
      <Button type="link" icon="copy" onClick={handleCopy}>
        Copy URI
      </Button>
    </div>
  );
};
