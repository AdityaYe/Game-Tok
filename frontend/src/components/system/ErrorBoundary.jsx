import React from "react";

import "../../styles/error-boundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="
          error-boundary
        "
        >
          <h2>Something went wrong</h2>

          <p>Please refresh the page.</p>

          <button onClick={this.handleRefresh}>Refresh</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
