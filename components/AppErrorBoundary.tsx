import React from 'react';

type State = {
  hasError: boolean;
  errorMessage: string;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unknown runtime error',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[AppErrorBoundary] Runtime error:', error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-retro-stripe flex items-center justify-center p-4">
          <div className="bg-[#fff6e3] border-[6px] border-[#2a3356] shadow-[8px_8px_0_rgba(42,51,86,0.35)] max-w-lg w-full p-6 text-center">
            <h1 className="text-2xl font-black text-[#2a3356] mb-3">앱 오류가 발생했어요</h1>
            <p className="text-sm text-slate-700 break-all mb-4">{this.state.errorMessage}</p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 font-bold text-white bg-[#2a3356] border-2 border-[#111827] hover:bg-[#1f2747]"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
