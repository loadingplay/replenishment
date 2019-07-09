import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

export default class seo extends Component {
  render() {
    let { title, description } = this.props
    return (
      <StaticQuery
        query={query}
        render={({
          site: {
            siteMetadata: { defaultTitle, titleTemplate, defaultDescription },
          },
        }) => {
          const seo = {
            title: title || defaultTitle,
            description: description || defaultDescription,
          }
          return (
            <>
              <Helmet title={seo.title} titleTemplate={titleTemplate}>
                <meta name="description" content={seo.description} />
              </Helmet>
            </>
          )
        }}
      />
    )
  }
}

seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

seo.defaultProps = {
  title: null,
  description: null,
}

const query = graphql`
  query seoData {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
      }
    }
  }
`
