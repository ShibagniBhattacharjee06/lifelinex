import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-red-100">
                        <h1 className="text-3xl font-black text-red-600 mb-4">Something went wrong.</h1>
                        <p className="text-slate-600 mb-6 font-medium">The application crashed. Here is the error details for the developer:</p>

                        <div className="bg-slate-900 rounded-xl p-6 overflow-auto max-h-96">
                            <code className="text-red-400 font-mono text-sm block mb-4">
                                {this.state.error && this.state.error.toString()}
                            </code>
                            <pre className="text-slate-400 font-mono text-xs whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
