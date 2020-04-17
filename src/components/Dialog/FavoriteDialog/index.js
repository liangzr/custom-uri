import React, { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import { noop } from '../../../tools';
import makeDirective from '../../../utils/makeDirective';
import * as db from '../../../db';
import { unique } from '../../../utils';

const getAllTags = async () => {
  const recents = await db.get('base', 'recents');
  const tags = recents.reduce((ret, cur) => ret.concat(cur.tags), []);

  return unique(tags);
};


const FavoriteDialog = ({
  value = [],
  href = '',
  title = '编辑链接',
  cb = noop,
  validator = noop,
}) => {
  const [visible, setVisible] = useState(true);
  const [tags, setTags] = useState(value);
  const [allTags, setAllTags] = useState([]);

  const handleSave = () => {
    const valid = validator(tags);
    if (valid) {
      cb(tags);
      setVisible(false);
    }
  };

  useEffect(() => {
    getAllTags().then(setAllTags);
  }, [tags]);

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSave}
      onCancel={() => setVisible(false)}
    >
      <div className="link-desc">{href}</div>
      <Select
        mode="tags"
        value={tags}
        placeholder="输入标签，方便辨别"
        onChange={setTags}
        style={{ width: '100%' }}
      >
        {allTags.map((val) => (
          <Select.Option key={val} value={val}>{val}</Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default makeDirective(FavoriteDialog, 'favorite-dialog-wrapper');