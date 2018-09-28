import { fromJS } from 'immutable'

const userToken = () => {
  var token = document.head.querySelector('meta[name=user_token]')
  return token ? token.content : undefined
}

const userId = () => {
  var id = document.head.querySelector('meta[name=user_id]')
  return id ? id.content : undefined
}

const initialState = fromJS({
  data: {
    token: userToken(),
    id: userId()
  }
})

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
