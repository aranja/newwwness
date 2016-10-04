import React, { PropTypes } from 'react'

class Html extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired
  }

  render() {
    const {content} = this.props

    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
          <title>App</title>
        </head>

        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        </body>
      </html>
    );
  }
}

export default Html
