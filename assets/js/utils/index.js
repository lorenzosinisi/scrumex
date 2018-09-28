import _ from 'lodash'
export function createActionTypes (base, actions = []) {
  return actions.reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}

export function createAction (type, data = {}) {
  return {type, payload: data}
}

export const errorMessage = (error) => {
  if (!error) {
    return ''
  }

  let code = error.errorCode
  if (!code) {
    code = error.response && error.response.status === 401
      ? 'Unauthorized'
      : 'InternalServerError'
  }

  return code
}

export const getSelectValuesIndex = (select) => {
  let result = []
  let options = select && select.options
  let opt

  for (let i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i]

    opt.selected && result.push(opt.index)
  }
  return result
}

export const findObjectByParam = (props, collection, paramName) => {
  const list = props[collection]
  const id = props.match.params[paramName]

  return _.find(list, (object) => {
    return object.id == id
  })
}

export const TrimString = (string, length) => {
  if (!string) { return }
  if (!length) { return }
  return string.length > length ? string.substring(0, length - 3) + "..." : string
}

export const prettyDate = (date) => {
  if (!date) { return }
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).split(' ').join('-')
}

export const prettyDateTime = (date) => {
  if (!date) { return }
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: "numeric",
    minute: "numeric",
  }).split(' ').join(' ')
}
