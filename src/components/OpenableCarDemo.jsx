import React, { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls } from '@react-three/drei';
import { ArrowLeft, DoorOpen, Info, RotateCcw, X } from 'lucide-react';
import GLBVehicle from './GLBVehicle';

const MODEL_URL = 'https://cdn.3dassets.dev/assets/27798/v1/model.glb';

class OpenableModelBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Openable CC0 reference car failed to load.', error); }
  render() {
    if (this.state.failed) return <div style={{ padding: 24, color: '#f4d9a2' }}>The reference car could not be loaded. Check your connection and try again.</div>;
    return this.props.children;
  }
}

export default function OpenableCarDemo({ onClose }) {
  const [modelInfo, setModelInfo] = useState(null);
  const [animationName, setAnimationName] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const handleModelInfo = useCallback((info) => setModelInfo(info), []);
  const play = (name) => setAnimationName((current) => current === name ? null : name);
  const buttonStyle = (active = false) => ({
    border: active ? '1px solid #d9b36b' : '1px solid #343941',
    background: active ? '#34291b' : '#15181d',
    color: active ? '#f4d9a2' : '#e5e7eb',
    borderRadius: 10, padding: '11px 13px', cursor: 'pointer',
    textTransform: 'capitalize', fontSize: 12, fontWeight: 650
  });
  return <div role="dialog" aria-modal="true" aria-label="Openable reference car" style={{ position: 'fixed', inset: 0, zIndex: 1200, background: '#080a0d', color: '#f4f4f5', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', padding: '16px clamp(16px, 4vw, 38px)', borderBottom: '1px solid #292d33', background: '#0d0f13' }}>
      <button onClick={onClose} style={buttonStyle()}><ArrowLeft size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} />Back to inspection</button>
      <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}><div style={{ color: '#d9b36b', fontSize: 10, letterSpacing: 2, fontWeight: 800 }}>OPENABLE CAR DEMO</div><strong style={{ display: 'block', marginTop: 4, fontSize: 'clamp(14px, 2vw, 20px)' }}>Animated compact hatchback</strong></div>
      <button onClick={onClose} aria-label="Close demo" style={buttonStyle()}><X size={17} /></button>
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(280px, .85fr)', gap: 18, padding: '18px clamp(12px, 3vw, 30px)', flex: 1 }}>
      <section style={{ minHeight: 360, height: 'min(68vh, 680px)', background: 'radial-gradient(ellipse at 50% 35%, #252a31 0%, #0a0c0f 70%)', border: '1px solid #292d33', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <OpenableModelBoundary><Canvas shadows dpr={[1, 1.5]} camera={{ position: [4.7, 2.8, 5.4], fov: 42 }}>
          <color attach="background" args={['#0a0c0f']} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 7, 5]} intensity={2.5} castShadow />
          <spotLight position={[-5, 5, -3]} intensity={35} angle={0.7} penumbra={1} color="#b6cfff" />
          <Environment preset="city" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow><planeGeometry args={[24, 24]} /><meshStandardMaterial color="#111419" roughness={0.38} metalness={0.35} /></mesh>
          <Suspense fallback={<Html center><span style={{ color: '#f4d9a2', whiteSpace: 'nowrap', fontSize: 12 }}>Loading animated model…</span></Html>}>
            <GLBVehicle modelUrl={MODEL_URL} scale={1.05} autoRotate={false} onModelInfo={handleModelInfo} animationName={animationName} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2.7} maxDistance={9} minPolarAngle={0.2} maxPolarAngle={Math.PI * 0.78} />
        </Canvas></OpenableModelBoundary>
        <div style={{ position: 'absolute', left: 14, bottom: 14, padding: '9px 12px', border: '1px solid #3a3e44', borderRadius: 9, background: '#0a0c0ddd', color: '#d1d5db', fontSize: 11 }}>Drag to rotate · Scroll or pinch to zoom</div>
      </section>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ border: '1px solid #292d33', borderRadius: 14, padding: 18, background: '#101216' }}>
          <div style={{ color: '#d9b36b', fontSize: 10, letterSpacing: 1.8, fontWeight: 800 }}>MOVABLE PARTS</div>
          <h2 style={{ margin: '8px 0', fontSize: 20 }}>Test the animations</h2>
          <p style={{ color: '#a8adb7', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>These controls play the motion clips embedded in the actual 3D file. Orbit around the model to inspect it from different angles.</p>
          {!modelInfo ? <p style={{ color: '#a8adb7', fontSize: 12 }}>Reading animation tracks from the model…</p> : modelInfo.animations.length ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{modelInfo.animations.map((name) => <button key={name} onClick={() => play(name)} style={buttonStyle(animationName === name)}>{name.replace(/[-_]+/g, ' ')}</button>)}</div> : <p style={{ color: '#f4d9a2', fontSize: 12 }}>No animation clips were found in this model.</p>}
          <button onClick={() => setAnimationName(null)} style={{ ...buttonStyle(), marginTop: 12 }}><RotateCcw size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Reset / stop animation</button>
        </div>
        {showInfo && <div style={{ border: '1px solid #292d33', borderRadius: 14, padding: 16, background: '#0d0f13' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f4d9a2', fontSize: 12, fontWeight: 750 }}><Info size={15} />Important model note</div>
          <p style={{ color: '#b3b8c2', fontSize: 12, lineHeight: 1.65 }}>This is a generic reference hatchback, not a Toyota, Lexus, Honda or a car currently listed for sale. The available file includes door and bonnet animation clips; it does not advertise a verified boot-opening animation. The production inventory needs matching models for each actual vehicle.</p>
          <button onClick={() => setShowInfo(false)} style={{ ...buttonStyle(), padding: '7px 10px' }}>Hide note</button>
        </div>}
        <div style={{ border: '1px solid #292d33', borderRadius: 14, padding: 16, background: '#101216' }}>
          <div style={{ color: '#d9b36b', fontSize: 10, letterSpacing: 1.5, fontWeight: 800 }}>ASSET LICENCE</div>
          <p style={{ color: '#b3b8c2', fontSize: 12, lineHeight: 1.6 }}>CC0 1.0 Universal · 3DAssets.dev</p>
          <a href="https://3dassets.dev/assets/car-factory-production-line-finished-compact-hatchback-03e14d24" target="_blank" rel="noreferrer" style={{ color: '#f4d9a2', fontSize: 12 }}>View source and licence ↗</a>
        </div>
      </aside>
    </div>
    <style>{'@media(max-width:760px){[aria-label="Openable reference car"] > div:nth-of-type(1){grid-template-columns:minmax(0,1fr)!important} [aria-label="Openable reference car"] section{height:48vh!important;min-height:300px!important}}'}</style>
  </div>;
}
