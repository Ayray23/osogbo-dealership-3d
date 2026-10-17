import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, ContactShadows, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, CarFront, ChevronDown, MapPin, Menu, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import './styles.css';

const cars = [
  { name: 'Toyota Camry XSE', year: 2021, price: '₦48.5M', type: 'Tokunbo', category: 'Sedan', color: '#cfd4d8' },
  { name: 'Lexus RX 350', year: 2020, price: '₦62M', type: 'Tokunbo', category: 'SUV', color: '#15171b' },
  { name: 'Toyota Highlander', year: 2022, price: '₦73M', type: 'Tokunbo', category: 'SUV', color: '#b7b1a5' },
  { name: 'Mercedes-Benz C300', year: 2021, price: '₦68M', type: 'Tokunbo', category: 'Luxury', color: '#111317' },
  { name: 'Honda Accord Sport', year: 2020, price: '₦39M', type: 'Nigerian Used', category: 'Sedan', color: '#e5e6e8' },
  { name: 'Lexus GX 460', year: 2019, price: '₦78M', type: 'Tokunbo', category: 'SUV', color: '#25282b' },
];

function Wheel({ position }) {
  return <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.43, 0.43, 0.25, 40]} />
      <meshStandardMaterial color="#101114" metalness={0.15} roughness={0.82} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.285, 0.285, 0.265, 32]} />
      <meshStandardMaterial color="#7e858b" metalness={0.92} roughness={0.22} />
    </mesh>
    <mesh position={[0, 0.145, 0]}>
      <cylinderGeometry args={[0.105, 0.105, 0.025, 24]} />
      <meshStandardMaterial color="#d6dadd" metalness={0.9} roughness={0.2} />
    </mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} rotation={[0, 0, (i * Math.PI) / 5]} position={[0, 0.145, 0]}>
      <boxGeometry args={[0.035, 0.24, 0.035]} />
      <meshStandardMaterial color="#d7dadd" metalness={0.9} roughness={0.24} />
    </mesh>)}
    <mesh position={[0, -0.145, 0]}>
      <cylinderGeometry args={[0.105, 0.105, 0.025, 24]} />
      <meshStandardMaterial color="#d6dadd" metalness={0.9} roughness={0.2} />
    </mesh>
  </group>;
}

function DemoCar({ color = '#d9dde1', scale = 1 }) {
  const group = useRef();
  const paint = useMemo(() => new THREE.MeshPhysicalMaterial({ color, metalness: 0.72, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }), [color]);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#101923', metalness: 0.35, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.92 }), []);
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.12; });
  return <group ref={group} scale={scale} position={[0, -0.48, 0]}>
    {/* Sculpted lower body and hood */}
    <mesh castShadow receiveShadow position={[0, 0.52, 0]} material={paint}>
      <boxGeometry args={[3.75, 0.54, 1.62, 4, 2, 2]} />
    </mesh>
    <mesh castShadow position={[1.13, 0.72, 0]} rotation={[0, 0, -0.045]} material={paint}>
      <boxGeometry args={[1.12, 0.19, 1.58, 2, 1, 2]} />
    </mesh>
    <mesh castShadow position={[-1.27, 0.69, 0]} rotation={[0, 0, 0.035]} material={paint}>
      <boxGeometry args={[0.9, 0.18, 1.56, 2, 1, 2]} />
    </mesh>
    {/* Roof and sloped windscreen */}
    <mesh castShadow position={[-0.02, 1.02, 0]} material={paint}>
      <boxGeometry args={[1.58, 0.12, 1.32, 2, 1, 2]} />
    </mesh>
    <mesh castShadow position={[0.74, 0.91, 0]} rotation={[0, 0, -0.48]} material={paint}>
      <boxGeometry args={[0.62, 0.12, 1.34, 2, 1, 2]} />
    </mesh>
    <mesh castShadow position={[-0.77, 0.9, 0]} rotation={[0, 0, 0.48]} material={paint}>
      <boxGeometry args={[0.62, 0.12, 1.34, 2, 1, 2]} />
    </mesh>
    {/* Panoramic dark glazing */}
    <mesh position={[-0.02, 1.08, 0]} material={glass}>
      <boxGeometry args={[1.48, 0.045, 1.22]} />
    </mesh>
    {[-0.66, 0.66].map((z) => <group key={z} position={[0, 0, z]}>
      <mesh position={[-0.03, 0.88, 0]} rotation={[0, 0, 0.08]} material={glass}>
        <boxGeometry args={[0.74, 0.3, 0.025]} />
      </mesh>
      <mesh position={[0.62, 0.88, 0]} rotation={[0, 0, -0.48]} material={glass}>
        <boxGeometry args={[0.48, 0.28, 0.025]} />
      </mesh>
      <mesh position={[-0.67, 0.87, 0]} rotation={[0, 0, 0.48]} material={glass}>
        <boxGeometry args={[0.48, 0.28, 0.025]} />
      </mesh>
      <mesh position={[0.05, 0.57, 0.018]}>
        <boxGeometry args={[0.015, 0.3, 0.02]} />
        <meshStandardMaterial color="#525960" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.47, 0.64, 0.045]}>
        <boxGeometry args={[0.12, 0.035, 0.035]} />
        <meshStandardMaterial color="#171a1d" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>)}
    {/* Front fascia, grille, LED headlamps and rear lamps */}
    <mesh position={[1.89, 0.48, 0]}>
      <boxGeometry args={[0.045, 0.25, 0.84]} />
      <meshStandardMaterial color="#16191c" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh position={[1.92, 0.48, 0]}>
      <boxGeometry args={[0.055, 0.16, 0.42]} />
      <meshStandardMaterial color="#050607" metalness={0.35} roughness={0.3} />
    </mesh>
    {[-0.55, 0.55].map((z) => <group key={z}>
      <mesh position={[1.89, 0.65, z]}>
        <boxGeometry args={[0.07, 0.1, 0.43]} />
        <meshStandardMaterial color="#e8f5ff" emissive="#b6dcff" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[-1.89, 0.62, z]}>
        <boxGeometry args={[0.06, 0.13, 0.34]} />
        <meshStandardMaterial color="#e52b36" emissive="#9d101b" emissiveIntensity={1.3} />
      </mesh>
    </group>)}
    <mesh position={[1.91, 0.29, 0]}>
      <boxGeometry args={[0.09, 0.07, 1.05]} />
      <meshStandardMaterial color="#252a30" metalness={0.8} roughness={0.25} />
    </mesh>
    <mesh position={[-1.91, 0.29, 0]}>
      <boxGeometry args={[0.09, 0.07, 1.05]} />
      <meshStandardMaterial color="#252a30" metalness={0.8} roughness={0.25} />
    </mesh>
    {/* Mirrors, door handles and wheels */}
    {[-0.7, 0.7].map((z) => <mesh key={z} position={[0.52, 0.86, z * 1.08]} castShadow>
      <sphereGeometry args={[0.095, 16, 12]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.2} />
    </mesh>)}
    {[-0.45, 0.38].map((x) => [-0.827, 0.827].map((z) => <mesh key={x + ':' + z} position={[x, 0.59, z]}>
      <boxGeometry args={[0.22, 0.025, 0.025]} />
      <meshStandardMaterial color="#dce0e4" metalness={0.85} roughness={0.22} />
    </mesh>))}
    <Wheel position={[1.22, 0.14, 0.82]} /><Wheel position={[-1.22, 0.14, 0.82]} />
    <Wheel position={[1.22, 0.14, -0.82]} /><Wheel position={[-1.22, 0.14, -0.82]} />
  </group>;
}

function Showroom() {
  return <>
    <color attach="background" args={['#050607']} />
    <fog attach="fog" args={['#050607', 8, 24]} />
    <PerspectiveCamera makeDefault position={[6.6, 3.1, 7.2]} fov={38} />
    <ambientLight intensity={0.45} />
    <spotLight position={[4, 7, 5]} intensity={130} angle={0.48} penumbra={0.8} castShadow shadow-mapSize={[2048, 2048]} />
    <spotLight position={[-5, 4, -1]} intensity={90} angle={0.6} penumbra={1} color="#7d9dff" />
    <pointLight position={[0, 2.4, 0]} intensity={20} color="#fff4dd" />
    <Environment preset="city" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} /><meshStandardMaterial color="#0c0e10" roughness={0.25} metalness={0.35} />
    </mesh>
    <mesh position={[0, 3.2, -4.8]} receiveShadow><boxGeometry args={[20, 7, 0.2]} /><meshStandardMaterial color="#090b0d" roughness={0.7} /></mesh>
    <mesh position={[0, 1.7, -4.55]}><boxGeometry args={[7, 0.03, 0.04]} /><meshStandardMaterial color="#d8aa55" emissive="#8d5f16" emissiveIntensity={2.2} /></mesh>
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.08}><DemoCar /></Float>
    <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={8} blur={2.8} far={5} />
    <OrbitControls enablePan={false} minDistance={5} maxDistance={10} minPolarAngle={Math.PI * 0.32} maxPolarAngle={Math.PI * 0.53} target={[0, 0.35, 0]} />
  </>;
}

function CarCard({ car, onView }) {
  return <article className="car-card">
    <div className="card-visual"><div className="mini-car"><div className="mini-window" /><div className="mini-body" style={{ background: car.color }} /><span className="mini-wheel w1" /><span className="mini-wheel w2" /></div><span className="condition">{car.type}</span></div>
    <div className="card-copy"><span className="year">{car.year}</span><h3>{car.name}</h3><p>{car.category} · Automatic · Petrol</p><div className="card-bottom"><strong>{car.price}</strong><button onClick={() => onView(car)}>3D View <ArrowRight size={15} /></button></div></div>
  </article>;
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [activeCar, setActiveCar] = useState(null);
  const [filter, setFilter] = useState('All');
  const visibleCars = useMemo(() => filter === 'All' ? cars : cars.filter(c => c.category === filter), [filter]);
  return <div className="app">
    <header className="nav"><div className="brand"><span className="brand-mark"><CarFront size={19} /></span><span>OSOGBO<br/><b>DEALERSHIP</b></span></div><nav className={menu ? 'open' : ''}><a href="#home">Home</a><a href="#inventory">Inventory</a><a href="#experience">3D Experience</a><a href="#about">About</a></nav><div className="nav-actions"><button className="icon-btn"><Search size={18} /></button><button className="menu-btn" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button><a className="nav-cta" href="#contact">Book a Test Drive <ArrowRight size={16} /></a></div></header>

    <main>
      <section id="home" className="hero">
        <div className="hero-canvas"><Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: 'high-performance' }}><Suspense fallback={<Html center><div className="loading">LOADING SHOWROOM</div></Html>}><Showroom /></Suspense></Canvas></div>
        <div className="hero-gradient" />
        <div className="hero-copy"><div className="eyebrow"><span /> OSOGBO · OSUN STATE · NIGERIA</div><h1>FIND YOUR<br/><em>EXTRAORDINARY</em><br/>DRIVE.</h1><p>Explore a curated collection of vehicles through a next-generation 3D dealership experience.</p><div className="hero-actions"><a href="#inventory" className="primary-btn">Explore Inventory <ArrowRight size={17} /></a><a href="#experience" className="ghost-btn">Enter 3D Experience <Sparkles size={16} /></a></div></div>
        <div className="hero-bottom"><div><MapPin size={15}/> Osogbo, Osun State</div><div className="scroll">SCROLL TO EXPLORE <ChevronDown size={15}/></div><div>EST. 2026</div></div>
      </section>

      <section id="inventory" className="inventory section"><div className="section-head"><div><span className="eyebrow dark"><span /> CURATED COLLECTION</span><h2>Cars worth<br/><em>turning heads.</em></h2></div><p>Popular Nigerian-market vehicles, selected for quality, presence and everyday performance.</p></div><div className="filters">{['All','SUV','Sedan','Luxury'].map(f => <button className={filter === f ? 'active' : ''} key={f} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="car-grid">{visibleCars.map(car => <CarCard key={car.name} car={car} onView={setActiveCar} />)}</div></section>

      <section id="experience" className="experience section"><div className="experience-stage"><Canvas camera={{ position: [5, 2.6, 6], fov: 40 }}><ambientLight intensity={0.55}/><spotLight position={[3,6,4]} intensity={100} angle={0.5} castShadow/><Environment preset="warehouse"/><Float speed={1} rotationIntensity={0.12} floatIntensity={0.08}><DemoCar color="#e1e3e5" scale={1.05}/></Float><ContactShadows position={[0,-0.62,0]} opacity={0.65} scale={8} blur={2.5}/><OrbitControls enablePan={false} minDistance={4.8} maxDistance={9} /></Canvas></div><div className="experience-copy"><span className="eyebrow dark"><span/> REAL-TIME 3D</span><h2>Don't just<br/><em>look at it.</em></h2><p>Rotate. Inspect. Get closer. Our interactive 3D viewer puts the vehicle in your hands before you ever step into the showroom.</p><div className="feature-row"><div><ShieldCheck/><b>Verified vehicles</b><span>Quality-first selection</span></div><div><Sparkles/><b>Immersive viewing</b><span>Built for every screen</span></div></div></div></section>

      <section id="about" className="about section"><span className="eyebrow dark"><span/> WHY OSOGBO DEALERSHIP</span><h2>Local roots.<br/><em>Premium standards.</em></h2><p>Based in Osogbo, we are creating a smarter way for Nigerian drivers to discover their next vehicle—combining a trusted local dealership experience with technology that makes choosing a car feel extraordinary.</p><a className="text-link" href="#contact">Talk to our team <ArrowRight size={16}/></a></section>
    </main>

    <footer id="contact" className="footer"><div><div className="brand footer-brand"><span className="brand-mark"><CarFront size={19}/></span><span>OSOGBO<br/><b>DEALERSHIP</b></span></div><p>Premium cars. Local expertise. Osogbo, Osun State.</p></div><div className="footer-contact"><span>READY FOR YOUR NEXT DRIVE?</span><a href="https://wa.me/2340000000000">WhatsApp the dealership <ArrowRight size={16}/></a></div><div className="copyright">© 2026 Osogbo Dealership · Built for Nigeria</div></footer>

    {activeCar && <div className="modal-backdrop" onClick={() => setActiveCar(null)}><div className="car-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActiveCar(null)}><X/></button><div className="modal-view"><Canvas camera={{ position: [4.8, 2.3, 5.5], fov: 40 }}><ambientLight intensity={0.5}/><spotLight position={[3,6,5]} intensity={120} angle={0.5} castShadow/><Environment preset="city"/><DemoCar color={activeCar.color} scale={1.05}/><ContactShadows position={[0,-0.62,0]} opacity={0.65} scale={8} blur={2.5}/><OrbitControls enablePan={false} minDistance={4} maxDistance={8}/></Canvas></div><div className="modal-info"><span className="eyebrow dark"><span/> {activeCar.type.toUpperCase()}</span><h2>{activeCar.name}</h2><p>{activeCar.year} · {activeCar.category} · Automatic · Petrol</p><strong>{activeCar.price}</strong><a className="primary-btn" href="https://wa.me/2340000000000">Enquire on WhatsApp <ArrowRight size={16}/></a></div></div></div>}
  </div>;
}
