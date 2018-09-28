import React, {Component} from 'react'
import PropTypes from 'prop-types'
import LoadingAnimation from '../components/LoadingAnimation'
import LoadingErrorMessage from '../components/LoadingErrorMessage'
const WithExternalLinks = (WrappedComponent) => {
  return class ExternalLinks extends Component {

    componentWillReceiveProps (nextProps) {
      const links = document.links;
      for (var i = 0, linksLength = links.length; i < linksLength; i++) {
         if (links[i].hostname != window.location.hostname) {
             links[i].target = '_blank';
         }
      }
    }

    render () {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
export default WithExternalLinks
