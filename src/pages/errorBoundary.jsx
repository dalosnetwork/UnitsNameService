
import { Component } from "react";

class ConsoleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error("Caught an error:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error details:", errorInfo);
  }

  render() {
    return this.props.children; // Continue rendering without an error page
  }
}

export default ConsoleErrorBoundary;
