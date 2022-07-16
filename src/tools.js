/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import URL from 'url'

export const safeParseJSON = (str) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

const whitelist = ['protocol', 'auth', 'host', 'pathname', 'hash', 'query']

export const parseURI = (uri) => {
  const parsed = URL.parse(uri)
  const nextURI = whitelist.reduce((ret, key) => {
    ret[key] = parsed[key]
    return ret
  }, {})
  if (nextURI.protocol) {
    nextURI.protocol = nextURI.protocol.replace(':', '')
  }

  return nextURI
}

export const formatURI = (uri) => {
  const nextURI = {
    ...uri,
  }
  if (nextURI.protocol) {
    nextURI.slashes = true
  }
  if (nextURI.query) {
    nextURI.search = `?${nextURI.query}`
  }
  return URL.format(nextURI)
}

export const QueryTool = {
  parser(search) {
    if (!search) return []

    const queryArray = []
    const query = new URLSearchParams(search)
    for (const item of query) {
      queryArray.push(item)
    }
    return queryArray
  },
  formatter: (query) => query
    .filter((item) => item[0] || item[1])
    .map((item) => `${item[0]}=${encodeURIComponent(item[1])}`)
    .join('&'),
}

export const JSONTool = {
  parser(json) {
    const obj = safeParseJSON(json)
    return Object.keys(obj).reduce((ret, key) => [...ret, [key, ret[key]]], [])
  },
  formatter() {},
}

export const formatReadableJSON = (str) => JSON.stringify(JSON.parse(str), null, 2)
export const noop = () => {}
