import React from 'react'
import URIParser from '../Parser/URIParser'
import QueryParser from '../Parser/QueryParser'
import JSONParser from '../Parser/JSONParser'
import { noop, safeParseJSON } from '../../tools'

import './ParserResolver.less'

const ParserTest = {
  URI: (v) => /^((\w+):\/\/|\/)/.test(v),
  Query: (v) => /=/.test(v),
  JSONArray: (v) => {
    if (/^[[]/.test(v)) {
      const ret = safeParseJSON(v)
      if (ret) return true
    }

    return false
  },
  JSON: (v) => {
    if (/^[{]/.test(v)) {
      const ret = safeParseJSON(v)
      if (ret) return true
    }

    return false
  },
}

export const hasCorrespondingParser = (val) => (
  ParserTest.URI(val)
    || ParserTest.Query(val)
    || ParserTest.JSON(val)
    || ParserTest.JSONArray(val)
)

export default ({
  value = '',
  onChange = noop,
  level = 0,
  ...args
}) => {
  const props = {
    value,
    onChange,
    level,
    ...args,
  }

  const renderParser = () => {
    if (ParserTest.URI(value)) {
      return <URIParser {...props} />
    }
    if (ParserTest.Query(value)) {
      return <QueryParser {...props} />
    }
    if (ParserTest.JSON(value)) {
      return <JSONParser {...props} />
    }

    return <div>Not Implement Parser</div>
  }

  return (
    <div className="parser-resolver-wrapper">
      {renderParser()}
    </div>
  )
}
