import React, { Component } from 'react'

class Layout extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

export default Layout
