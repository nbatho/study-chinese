import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="anim-pop rounded-lg border bg-card px-6 py-12 text-center shadow-sm">
        <h2 className="text-2xl font-extrabold">Something went wrong</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The current screen could not be rendered. You can reload the app and continue studying.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Reload app
        </button>
      </div>
    );
  }
}
