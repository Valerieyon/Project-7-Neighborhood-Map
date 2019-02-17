import React, { Component } from 'react';

class ErrorOccurred extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
      // display fallback UI
      this.setState({ hasError: true });
    }

    render() {
      if (this.state.hasError) {
        return <h1>Error Occurred.</h1>;
      }
      return this.props.children;
    }
  }

export default ErrorOccurred
