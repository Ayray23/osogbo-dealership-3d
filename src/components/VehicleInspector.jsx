import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls } from '@react-three/drei';
import { ArrowLeft, CarFront, Check, ChevronRight, CircleHelp, DoorOpen, Gauge, Info, Layers3, X } from 'lucide-react';
import * as THREE from 'three';
import GLBVehicle from './GLBVehicle';

class InspectorModelBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Inspection vehicle model failed to load.', error); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const zones = [
  { id: 'exterior', label: 'Exterior', icon: CarFront, title: 'Walk around the vehicle', description: 'Rotate the vehicle and inspect its exterior lines, wheels, lighting and body details.' },
  { id: 'cabin', label: 'Cabin', icon: DoorOpen, title: 'Cabin & seating', description: 'Explore a conceptual cabin layout. Exact upholstery, controls and trim depend on the vehicle specification.' },
  { id: 'boot', label: 'Boot', icon: Layers3, title: 'Cargo & boot space', description: 'Inspect the cargo area concept. Actual capacity and under-floor storage vary by model and trim.' },
  { id: 'engine', label: 'Engine bay', icon: Gauge, title: 'Under the bonnet', description: 'Explore a simplified engine-bay layout. Component placement is illustrative, not a service manual for this exact vehicle.' },
];

const features = {
  exterior: [
    ['Headlights', 'Lighting units help illuminate the road and improve visibility. Exact lighting technology varies by trim.'],
    ['Wheels & tyres', 'Tyre size, wheel design and condition should be checked on the specific vehicle before purchase.'],
    ['Side mirrors', 'Help the driver monitor traffic beside and behind the vehicle. Some trims add power adjustment or folding.'],
    ['Body & paint', 'Inspect panel alignment, paint finish, glass and visible signs of repairs during a physical viewing.'],
  ],
  cabin: [
    ['Driver cockpit', 'The driving position groups the steering wheel, instrument display and primary controls around the driver.'],
    ['Infotainment display', 'Depending on specification, this area may support audio, vehicle settings, navigation or phone connectivity.'],
    ['Front seats', 'Check adjustment range, comfort, upholstery condition and any powered or heated functions on the actual vehicle.'],
    ['Rear seating', 'Check legroom, headroom, seat-folding arrangements and seat-belt condition in person.'],
    ['Centre console', 'Usually houses storage and selected driving or comfort controls; exact layout varies by model year.'],
  ],
  boot: [
    ['Cargo floor', 'A flat cargo floor can make luggage easier to load. Check the real vehicle dimensions for your needs.'],
    ['Rear seat backs', 'Some vehicles allow the rear seats to fold to increase usable cargo length. Confirm the exact split and mechanism.'],
    ['Under-floor storage', 'The compartment may hold tools or a spare wheel, depending on the vehicle and market specification.'],
    ['Tailgate opening', 'Check opening height, latch operation and whether the vehicle has a manual or powered tailgate.'],
  ],
  engine: [
    ['Engine assembly', 'The power unit converts fuel or stored energy into motion. Confirm engine code and displacement from vehicle documents.'],
    ['Battery', 'Supplies electrical power for starting and vehicle systems. Check terminals, age and charging condition.'],
    ['Coolant reservoir', 'Part of the engine cooling system. Never open a hot cooling system; have levels and condition checked safely.'],
    ['Air intake', 'Feeds filtered air to the engine. Inspect the air filter and intake components during servicing.'],
    ['Fluid service points', 'Oil, coolant and other service points vary by engine. Follow the vehicle-specific manual for checks and maintenance.'],
  ],
};

function CarFallback({ color = '#b9c1c9' }) {
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color, metalness: .68, roughness: .24, clearcoat: 1 }), [color]);
  return <group position={[0, -.3, 0]}>
    <mesh castShadow material={material}><boxGeometry args={[3.4, .55, 1.48, 2, 1, 1]} /></mesh>
    <mesh position={[-.08, .42, 0]} castShadow material={material}><boxGeometry args={[1.95, .62, 1.25, 2, 1, 1]} /></mesh>
    {[-1.12, 1.12].flatMap(x => [-.76, .76].map(z => <group key={x + ':' + z} position={[x, -.05, z]} rotation={[Math.PI / 2, 0, 0]}><mesh><cylinderGeometry args={[.36, .36, .2, 32]} /><meshStandardMaterial color="#111318" /></mesh><mesh><cylinderGeometry args={[.19, .19, .21, 24]} /><meshStandardMaterial color="#9299a2" metalness={.8} roughness={.25} /></mesh></group>))}
  </group>;
}

function CabinModel() {
  return <group position={[0, -.15, 0]}>
    <mesh position={[0, -.25, 0]}><boxGeometry args={[3.2, .12, 1.5]} /><meshStandardMaterial color="#25282d" /></mesh>
    <mesh position={[0, .2, -.45]} rotation={[.12, 0, 0]}><boxGeometry args={[2.8, .08, .5]} /><meshStandardMaterial color="#171a1f" /></mesh>
    {[-.85, .85].map(x => <group key={x} position={[x, .05, -.35]}><mesh position={[0, .16, 0]}><boxGeometry args={[.72, .25, .72]} /><meshStandardMaterial color="#383b40" roughness={.9} /></mesh><mesh position={[0, .5, -.25]} rotation={[-.12, 0, 0]}><boxGeometry args={[.68, .65, .13]} /><meshStandardMaterial color="#44484f" roughness={.9} /></mesh></group>)}
    {[-.85, .85].map(x => <group key={'rear'+x} position={[x, .02, .42]}><mesh position={[0, .13, 0]}><boxGeometry args={[.72, .2, .55]} /><meshStandardMaterial color="#383b40" roughness={.9} /></mesh><mesh position={[0, .34, .19]}><boxGeometry args={[.68, .4, .12]} /><meshStandardMaterial color="#44484f" roughness={.9} /></mesh></group>)}
    <mesh position={[0, .48, -.78]} rotation={[.12, 0, 0]}><boxGeometry args={[2.35, .1, .25]} /><meshStandardMaterial color="#191c20" /></mesh>
    <mesh position={[-.65, .43, -.76]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.22, .035, 12, 32]} /><meshStandardMaterial color="#c5c9cd" metalness={.7} /></mesh>
    <mesh position={[.42, .47, -.75]}><boxGeometry args={[.48, .22, .04]} /><meshStandardMaterial color="#7aa5b9" emissive="#183440" emissiveIntensity={.6} /></mesh>
    <mesh position={[0, .56, .25]}><boxGeometry args={[2.6, .08, .1]} /><meshStandardMaterial color="#1c1e22" /></mesh>
  </group>;
}

function BootModel() {
  return <group position={[0, -.1, 0]}>
    <mesh position={[0, -.15, 0]}><boxGeometry args={[3.05, .12, 1.65]} /><meshStandardMaterial color="#25282d" /></mesh>
    <mesh position={[0, .06, -.55]}><boxGeometry args={[2.85, .35, .5]} /><meshStandardMaterial color="#34383e" /></mesh>
    <mesh position={[0, .04, .45]}><boxGeometry args={[2.65, .08, .58]} /><meshStandardMaterial color="#3d4148" /></mesh>
    <mesh position={[0, .18, .38]}><boxGeometry args={[1.05, .22, .42]} /><meshStandardMaterial color="#565b62" /></mesh>
    <mesh position={[-.92, .05, .4]}><boxGeometry args={[.4, .16, .42]} /><meshStandardMaterial color="#565b62" /></mesh>
    <mesh position={[.92, .05, .4]}><boxGeometry args={[.4, .16, .42]} /><meshStandardMaterial color="#565b62" /></mesh>
  </group>;
}

function EngineModel() {
  return <group position={[0, -.05, 0]}>
    <mesh position={[0, -.2, 0]}><boxGeometry args={[3.1, .14, 1.7]} /><meshStandardMaterial color="#24272c" /></mesh>
    <mesh position={[0, .18, -.05]}><boxGeometry args={[1.3, .55, .95]} /><meshStandardMaterial color="#373c43" metalness={.55} roughness={.55} /></mesh>
    <mesh position={[0, .48, -.05]}><boxGeometry args={[.95, .12, .72]} /><meshStandardMaterial color="#171a1f" /></mesh>
    {[-.55, -.18, .18, .55].map(x => <mesh key={x} position={[x, .27, -.05]}><boxGeometry args={[.12, .35, .75]} /><meshStandardMaterial color="#555b63" metalness={.6} /></mesh>)}
    <mesh position={[-.95, .05, .25]}><boxGeometry args={[.55, .32, .52]} /><meshStandardMaterial color="#24282d" /></mesh>
    <mesh position={[.95, .04, .32]}><boxGeometry args={[.52, .4, .55]} /><meshStandardMaterial color="#252a30" /></mesh>
    <mesh position={[.95, .27, .32]}><boxGeometry args={[.28, .06, .25]} /><meshStandardMaterial color="#a6b2be" metalness={.65} /></mesh>
    <mesh position={[-.6, .35, .48]}><cylinderGeometry args={[.16, .16, .2, 24]} /><meshStandardMaterial color="#d8b53d" /></mesh>
    <mesh position={[.6, .3, -.48]}><cylinderGeometry args={[.14, .14, .2, 24]} /><meshStandardMaterial color="#4185b5" /></mesh>
    <mesh position={[0, -.01, .65]}><boxGeometry args={[1.25, .28, .18]} /><meshStandardMaterial color="#121519" /></mesh>
  </group>;
}

function InspectionScene({ car, zone, activeFeature, onFeature, modelInfo, animationName, onModelInfo, onPlayAnimation }) {
  const zoneFeatures = features[zone];
  return <>
    <color attach="background" args={['#0a0c0f']} />
    <ambientLight intensity={zone === 'exterior' ? .65 : 1.15} />
    <directionalLight position={[4, 7, 5]} intensity={2.3} castShadow />
    <spotLight position={[-5, 5, -3]} intensity={55} angle={.7} penumbra={1} color="#b6cfff" />
    <Environment preset="city" />
    {zone === 'exterior' ? <InspectorModelBoundary fallback={<CarFallback color={car.color} />}><Suspense fallback={<CarFallback color={car.color} />}><GLBVehicle modelUrl={car.modelUrl} color={car.color} scale={1.1} autoRotate={false} onModelInfo={onModelInfo} animationName={animationName} /></Suspense></InspectorModelBoundary> : zone === 'cabin' ? <CabinModel /> : zone === 'boot' ? <BootModel /> : <EngineModel />}
    {zone !== 'exterior' && <ContactShadows position={[0, -.45, 0]} opacity={.45} scale={7} blur={2.4} far={4} />}
    <OrbitControls enablePan={false} minDistance={2.4} maxDistance={7} minPolarAngle={.28} maxPolarAngle={Math.PI * .78} />
    {zoneFeatures.map(([name], i) => <Html key={zone + name} position={[((i % 3) - 1) * .72, .75 - Math.floor(i / 3) * .45, zone === 'exterior' ? .72 : .4]} distanceFactor={7} occlude={false}>
      <button className={'inspection-pin ' + (activeFeature === name ? 'active' : '')} onClick={(event) => { event.stopPropagation(); onFeature(name); }} title={'Inspect ' + name}><span>{i + 1}</span></button>
    </Html>)}
  </>;
}

export default function VehicleInspector({ car, onClose, onEnquire }) {
  const [zone, setZone] = useState('exterior');
  const [modelInfo, setModelInfo] = useState(null);
  const [animationName, setAnimationName] = useState(null);
  const handleModelInfo = useCallback((info) => setModelInfo(info), []);
  const [activeFeature, setActiveFeature] = useState(features.exterior[0][0]);
  const featureList = features[zone];
  const current = featureList.find(([name]) => name === activeFeature) || featureList[0];
  const switchZone = (next) => { setZone(next); setActiveFeature(features[next][0][0]); };
  return <div className="vehicle-inspector" role="dialog" aria-modal="true" aria-label={'Inspect ' + car.name}>
    <header className="inspector-topbar">
      <button className="inspector-back" onClick={onClose}><ArrowLeft size={17} /> Back to vehicles</button>
      <div className="inspector-vehicle-name"><span>VEHICLE INSPECTION</span><strong>{car.name}</strong><small>{car.year} · {car.category} · {car.condition}</small></div>
      <button className="inspector-close" onClick={onClose} aria-label="Close inspection"><X /></button>
    </header>
    <div className="inspector-layout">
      <section className="inspector-viewer">
        <div className="inspector-viewer-heading"><span><i className="live-dot" /> INTERACTIVE 3D VIEW</span><span>Drag to rotate · Scroll or pinch to zoom</span></div>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [4, 2.4, 4.8], fov: 42 }}>
          <InspectionScene car={car} zone={zone} activeFeature={current[0]} onFeature={setActiveFeature} modelInfo={modelInfo} animationName={animationName} onModelInfo={handleModelInfo} onPlayAnimation={setAnimationName} />
        </Canvas>
        <div className="inspector-view-label">{zones.find(z => z.id === zone)?.label}<span>·</span>{zone === 'exterior' ? 'Exterior asset' : 'Illustrative component view'}</div>
        <div className="inspector-zone-tabs" role="tablist" aria-label="Vehicle areas">
          {zones.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={zone === id} className={zone === id ? 'active' : ''} onClick={() => switchZone(id)}><Icon size={17} /><span>{label}</span></button>)}
        </div>
        {zone !== 'exterior' && <p className="inspector-disclaimer"><Info size={15} /> This area is a 3D layout concept, not an exact scan of this vehicle. The current exterior GLB assets do not include verified movable doors, bonnet, boot or detailed interiors.</p>}
        {zone === 'exterior' && <section className="inspector-model-capabilities" aria-live="polite">
          <div className="inspector-capability-heading"><strong>Model capability check</strong><span>{modelInfo ? 'Model inspected' : 'Checking model…'}</span></div>
          {!modelInfo ? <p>Reading the 3D file for real vehicle parts and built-in animations.</p> : <>
            <div className="inspector-capability-chips">
              {Object.entries({doors:'Door parts',bonnet:'Bonnet/hood',boot:'Boot/tailgate',interior:'Interior parts',engine:'Engine parts'}).map(([key,label]) => <span key={key} className={modelInfo.parts[key] ? 'detected' : ''}><i />{label}</span>)}
            </div>
            {modelInfo.animations.length > 0 ? <>
              <p className="inspector-capability-copy">This model includes {modelInfo.animations.length} built-in animation{modelInfo.animations.length === 1 ? '' : 's'}. Play an animation to test the movement embedded in the model.</p>
              <div className="inspector-animation-controls">{modelInfo.animations.map((name) => <button key={name} className={animationName === name ? 'active' : ''} onClick={() => onPlayAnimation(name)}>{name.replace(/[-_]+/g, ' ')}</button>)}<button className="stop-animation" onClick={() => onPlayAnimation(null)}>Stop</button></div>
            </> : <p className="inspector-capability-copy">This 3D file has no embedded animations, so doors, bonnet and boot cannot genuinely open in this model. I’m not faking those movements; this vehicle needs an articulated model asset before those controls can be enabled.</p>}
          </>}
        </section>}
      </section>
      <aside className="inspector-details">
        <div className="inspector-section-kicker">EXPLORE THE DETAILS</div>
        <h2>{zones.find(z => z.id === zone)?.title}</h2>
        <p className="inspector-intro">{zones.find(z => z.id === zone)?.description}</p>
        <div className="inspector-feature-list">{featureList.map(([name], i) => <button key={name} className={current[0] === name ? 'active' : ''} onClick={() => setActiveFeature(name)}><span className="feature-index">{String(i + 1).padStart(2, '0')}</span><span>{name}</span>{current[0] === name ? <Check size={16} /> : <ChevronRight size={16} />}</button>)}</div>
        <div className="inspector-feature-card"><span className="feature-card-icon"><CircleHelp size={18} /></span><span className="inspector-section-kicker">FEATURE EXPLAINED</span><h3>{current[0]}</h3><p>{current[1]}</p></div>
        <div className="inspector-spec-grid"><div><span>Fuel</span><strong>{car.fuel}</strong></div><div><span>Transmission</span><strong>{car.transmission}</strong></div><div><span>Drivetrain</span><strong>{car.drive}</strong></div><div><span>Price</span><strong>{car.price}</strong></div></div>
        <button className="primary inspector-enquire" onClick={() => onEnquire(car)}>Enquire about this car <ChevronRight size={17} /></button>
        <small className="inspector-note">Vehicle specifications and equipment should be confirmed against the actual unit for sale.</small>
      </aside>
    </div>
  </div>;
}
