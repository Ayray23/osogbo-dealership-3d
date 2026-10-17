import React, { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls } from '@react-three/drei';
import { ArrowLeft, CheckCircle2, DoorOpen, Gauge, Info, Play, RotateCcw, X } from 'lucide-react';
import GLBVehicle from './GLBVehicle';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/JaronKBragg7337/spectral-gt-rs@34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb';
const REFERENCES = [
  { label: 'Exterior', src: 'https://cdn.jsdelivr.net/gh/JaronKBragg7337/spectral-gt-rs@34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_beauty.png' },
  { label: 'Cockpit', src: 'https://cdn.jsdelivr.net/gh/JaronKBragg7337/spectral-gt-rs@34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_cockpit.png' },
  { label: 'Front detail', src: 'https://cdn.jsdelivr.net/gh/JaronKBragg7337/spectral-gt-rs@34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_front.png' },
  { label: 'Rear detail', src: 'https://cdn.jsdelivr.net/gh/JaronKBragg7337/spectral-gt-rs@34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rear.png' },
];

export default function ReferenceCarDemo({ onClose }) {
  const [modelInfo, setModelInfo] = useState(null);
  const [animationName, setAnimationName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleModelInfo = useCallback((info) => setModelInfo(info), []);

  return <div className="reference-car-demo" role="dialog" aria-modal="true" aria-label="Animated reference car demonstration">
    <header className="reference-demo-topbar">
      <button onClick={onClose}><ArrowLeft size={17} /> Return to selected vehicle</button>
      <div><span>INTERACTIVE ASSET DEMO</span><strong>Animated concept sports car</strong><small>Independent reference model · not the car listed for sale</small></div>
      <button className="reference-demo-close" onClick={onClose} aria-label="Close reference demo"><X /></button>
    </header>
    <div className="reference-demo-layout">
      <section className="reference-demo-stage">
        <div className="reference-demo-stage-heading"><span><i /> LIVE 3D MODEL</span><span>Drag to orbit · Pinch or scroll to zoom</span></div>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [4.2, 2.2, 4.8], fov: 42 }}>
          <color attach="background" args={['#090c10']} />
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 7, 5]} intensity={2.4} castShadow />
          <spotLight position={[-5, 5, -3]} intensity={45} angle={0.7} penumbra={1} color="#b6cfff" />
          <Environment preset="city" />
          <Suspense fallback={<Html center><div className="reference-demo-loading">Loading 3D model…</div></Html>}>
            <GLBVehicle modelUrl={MODEL_URL} color="#d5d8dc" scale={1.15} autoRotate={false} onModelInfo={handleModelInfo} animationName={animationName} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2.6} maxDistance={8} minPolarAngle={0.25} maxPolarAngle={Math.PI * 0.78} />
        </Canvas>
        <div className="reference-demo-images">
          {REFERENCES.map((item, index) => <button key={item.label} className={selectedImage === index ? 'active' : ''} onClick={() => setSelectedImage(index)} aria-label={'View ' + item.label + ' reference image'}>
            <img src={item.src} alt={item.label} loading="lazy" /><span>{item.label}</span>
          </button>)}
        </div>
        <div className="reference-demo-image-note"><Info size={14} /> Reference renders show the same concept model from different angles; the 3D viewer remains interactive above.</div>
        {selectedImage !== null && <div className="reference-image-lightbox" role="dialog" aria-modal="true" aria-label={REFERENCES[selectedImage].label} onClick={() => setSelectedImage(null)}><button onClick={() => setSelectedImage(null)} aria-label="Close image preview"><X size={20} /></button><img src={REFERENCES[selectedImage].src} alt={REFERENCES[selectedImage].label + ' enlarged reference view'} onClick={(event) => event.stopPropagation()} /><span>{REFERENCES[selectedImage].label} · reference render</span></div>}
      </section>
      <aside className="reference-demo-controls">
        <span className="reference-demo-kicker">TRY REAL MODEL ANIMATIONS</span>
        <h2>Open the moving parts</h2>
        <p>This CC0 concept asset includes real animation clips embedded in its GLB file. Select a clip to play it on the actual model rather than faking an opening panel.</p>
        <div className="reference-demo-part-list">
          <div><DoorOpen size={18} /><span><strong>Door movement</strong><small>Animated door panels</small></span><CheckCircle2 size={16} /></div>
          <div><Gauge size={18} /><span><strong>Bonnet / engine service</strong><small>Hood service animation</small></span><CheckCircle2 size={16} /></div>
        </div>
        <div className="reference-demo-animations">
          <h3>Available animations</h3>
          {!modelInfo ? <p>Reading the model and its animation clips…</p> : modelInfo.animations.length ? modelInfo.animations.map((name) => <button key={name} className={animationName === name ? 'active' : ''} onClick={() => setAnimationName(name)}><Play size={14} fill="currentColor" /><span>{name.replace(/[_-]+/g, ' ')}</span></button>) : <p>No animation clips were found in this asset.</p>}
          {animationName && <button className="reference-demo-reset" onClick={() => setAnimationName(null)}><RotateCcw size={14} /> Stop / reset animation</button>}
        </div>
        <div className="reference-demo-license"><strong>Asset & licensing</strong><p>Model and reference renders: Spectral GT RS by Jaron K. Bragg, dedicated to CC0 1.0 public domain. This is a fictional demonstration car, not a Toyota, Lexus or Honda model.</p><a href="https://github.com/JaronKBragg7337/spectral-gt-rs" target="_blank" rel="noreferrer">View source and asset details ↗</a></div>
      </aside>
    </div>
  </div>;
}
