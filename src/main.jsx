import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#050607', color: '#f4f5f6', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <section style={{ maxWidth: '480px' }}>
            <p style={{ color: '#d4a64c', letterSpacing: '.16em', fontSize: '11px' }}>OSOGBO DEALERSHIP</p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>We hit a loading problem.</h1>
            <p style={{ color: '#aeb2b6', lineHeight: 1.7 }}>The showroom could not finish rendering. Please refresh the page. The rest of the site is protected from a failed 3D preview.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 18px', border: 0, cursor: 'pointer', background: '#f1eee8', color: '#08090a', fontWeight: 700 }}>Refresh website</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
