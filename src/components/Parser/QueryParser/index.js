import React from 'react'

import DictParser from '../DictParser'
import { QueryTool } from '../../../tools'

import './QueryParser.less'

const extra = {
  ...QueryTool,
  className: 'query-parser',
}

export default (props) => <DictParser {...props} extra={extra} />
