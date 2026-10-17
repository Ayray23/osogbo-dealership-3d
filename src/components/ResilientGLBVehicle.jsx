import React, { useEffect, useMemo, useState } from 'react';
import GLBVehicle from './GLBVehicle';

class ModelAttemptBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onFailure(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function alternateModelUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'raw.githubusercontent.com') {
      const [, owner, repo, revision, ...path] = parsed.pathname.split('/');
      if (owner && repo && revision && path.length) {
        return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${revision}/${path.join('/')}`;
      }
    }
    if (parsed.hostname === 'cdn.jsdelivr.net') {
      const match = parsed.pathname.match(/^\/gh\/([^/]+)\/([^/@]+)@([^/]+)\/(.+)$/);
      if (match) return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
    }
  } catch {
    // If a URL is malformed, leave it as-is and let the fallback model render.
  }
  return null;
}

export default function ResilientGLBVehicle({
  modelUrl,
  fallback = null,
  onModelInfo,
  ...vehicleProps
}) {
  const [attempt, setAttempt] = useState(0);
  const urls = useMemo(
    () => [modelUrl, alternateModelUrl(modelUrl)].filter((url, index, all) => url && all.indexOf(url) === index),
    [modelUrl]
  );

  useEffect(() => {
    setAttempt(0);
  }, [modelUrl]);

  useEffect(() => {
    if (attempt < urls.length || !onModelInfo) return;
    onModelInfo({
      nodeNames: [],
      animations: [],
      parts: { doors: false, bonnet: false, boot: false, interior: false, engine: false },
      loadFailed: true,
    });
  }, [attempt, urls.length, onModelInfo]);

  if (attempt >= urls.length) return fallback;

  return (
    <ModelAttemptBoundary
      key={`${modelUrl}:${attempt}`}
      onFailure={() => setAttempt((current) => current + 1)}
    >
      <GLBVehicle modelUrl={urls[attempt]} onModelInfo={onModelInfo} {...vehicleProps} />
    </ModelAttemptBoundary>
  );
}
