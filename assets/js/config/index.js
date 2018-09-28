let env
if (process.env.NODE_ENV === 'production') {
  env = require('./production-env.js')
} else {
  env = require('./development-env.js')
}

export const CONFIGURATION = env
