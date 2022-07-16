/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react'
import {
  Input,
  Affix,
  Icon,
  message,
  List,
  Popconfirm,
  Card,
  Tooltip,
  Button,
  Row,
  Col,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { useScroll } from 'react-use'

import { noop } from '../../tools'
import * as db from '../../db'
import { hasCorrespondingParser } from '../ParserResolver'
import FavoriteDialog from '../Dialog/FavoriteDialog'

import './Welcome.less'

const breakChange = (prev, next) => {
  const prevLength = prev.length
  const nextLength = next.length
  if (Math.abs(prevLength - nextLength) > 10 && nextLength > 0) {
    return true
  }

  return false
}

const computeOpacity = (y) => {
  const height = 150
  return y > height ? 0 : (height - y) / height
}

export default ({ value = '', mode = false, onChange = noop }) => {
  const container = useRef(null)
  const [recent, setRecent] = useState([])
  const [filterString, setFilterString] = useState('')
  const { y } = useScroll(container)

  const updateRecent = async () => {
    const ret = await db.get('base', 'recent')
    setRecent(ret.reverse())
  }

  useEffect(() => {
    if (!mode) {
      updateRecent()
    }
  }, [mode])

  const handleChange = (val) => {
    onChange(val, breakChange(value, val))
  }

  const handleEdit = () => {
    if (hasCorrespondingParser(value)) {
      onChange(value, true)
    } else {
      message.warn('Unable to resolve current URI')
    }
  }

  const handleDelete = (id) => {
    db.get('base', 'recent')
      .then((data) => db.set(
        'base',
        'recent',
        data.filter((i) => i.id !== id),
      ))
      .finally(() => {
        updateRecent()
      })
  }

  const onChangeTitle = (index) => {
    const savedItem = recent[index]
    const validator = (val) => {
      if (val.length < 1) {
        message.warn('Tags cannot be empty')
        return false
      }
      return true
    }

    FavoriteDialog.show(
      {
        title: 'Modify URI',
        value: savedItem.tags || [],
        href: savedItem.value,
      },
      (val) => {
        db.get('base', 'recent')
          .then((dbRecent = []) => {
            const target = dbRecent.find((r) => r.id === savedItem.id)
            if (target) {
              target.tags = val
            }
            db.set('base', 'recent', dbRecent)
          })
          .finally(() => {
            message.success('Saved!')
            updateRecent()
          })
      },
      validator,
    )
  }

  const renderRecent = () => (
    <QueueAnim type={['right', 'left']} duration={[250, 180]} leaveReverse>
      {recent
        .filter(
          (r) => !filterString
            || r.tags.some((t) => t.toLowerCase().includes(filterString.toLowerCase())),
        )
        .map((item, index) => (
          <Card key={item.id} hoverable>
            <List.Item
              actions={[
                <a href="#" onClick={() => onChange(item.value, true)}>
                  Use
                </a>,
                <Popconfirm
                  title="Deletion is irreversible, are you sure?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="OK"
                  cancelText="Cancel"
                >
                  <a href="#">Delete</a>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={(
                  <div>
                    <span>{item.tags ? item.tags.sort().join(' | ') : ''}</span>
                    <Button
                      icon="edit"
                      type="link"
                      onClick={() => onChangeTitle(index)}
                    />
                  </div>
                )}
                description={item.value}
              />
            </List.Item>
          </Card>
        ))}
    </QueueAnim>
  )

  const renderRecentHeader = () => (
    <Row
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <Col span={10}>Favorites URI</Col>
      <Col span={14} style={{ textAlign: 'right' }}>
        <Input.Search
          placeholder="Filter Tags"
          onChange={(e) => setFilterString(e.target.value)}
          style={{ width: 200 }}
        />
      </Col>
    </Row>
  )

  return (
    <div className="welcome-container" ref={container}>
      <div className="content">
        <h1 style={{ opacity: computeOpacity(y) }}>URI Generation Tool</h1>
        <Affix offsetTop={20} target={() => container.current}>
          <div className="input">
            <Input.TextArea
              placeholder="Type your URI or paste here"
              value={value}
              autoSize
              onChange={(e) => handleChange(e.target.value)}
            />
            <Tooltip
              placement="top"
              title="Shift + Meta + Comma to switch panel"
              mouseEnterDelay={0.8}
            >
              <div className="go" onClick={handleEdit}>
                <Icon type="arrow-right" />
              </div>
            </Tooltip>
          </div>
        </Affix>
        {recent.length > 0 && (
          <List className="recent" header={renderRecentHeader()}>
            {renderRecent()}
          </List>
        )}
      </div>
    </div>
  )
}
