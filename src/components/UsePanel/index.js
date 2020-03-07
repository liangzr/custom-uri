import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { Input } from 'antd';
import qrcode from 'qrcode';

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

  return (
    <div className="use-panel-wrapper">
      <img className="qrcode" src={imageData} alt="" />
      <Input.TextArea
        value={href}
        autoSize={{
          maxRows: 4,
        }}
      />
    </div>
  );
};
