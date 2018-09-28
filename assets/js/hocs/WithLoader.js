import React, {Component} from 'react'
import PropTypes from 'prop-types'
import LoadingAnimation from '../components/LoadingAnimation'
import LoadingErrorMessage from '../components/LoadingErrorMessage'
const WithLoader = (WrappedComponent) => {
  return class isLoading extends Component {
    static propTypes = {
      loading: PropTypes.bool
    }

    state = {
      loading: false,
      error: false
    }

    componentWillReceiveProps (nextProps) {
      const { loading, error } = nextProps
      this.setState({ loading, error })
    }

    render () {
      const { loading, error } = this.state
      return (
        <div>
          <LoadingAnimation iconSize={44} loading={loading} />
          <LoadingErrorMessage iconSize={44} error={error} />
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
export default WithLoader
