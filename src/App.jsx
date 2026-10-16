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

function Wheel({ position, color = '#101114' }) {
  return <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
    <cylinderGeometry args={[0.43, 0.43, 0.24, 32]} />
    <meshStandardMaterial color={color} metalness={0.8} roughness={0.24} />
  </mesh>;
}

function DemoCar({ color = '#d9dde1', scale = 1 }) {
  const group = useRef();
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.18; });
  return <group ref={group} scale={scale} position={[0, -0.25, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
      <boxGeometry args={[3.7, 0.62, 1.55]} />
      <meshPhysicalMaterial color={color} metalness={0.68} roughness={0.2} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
    <mesh castShadow position={[0.15, 0.92, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[2.05, 0.65, 1.38]} />
      <meshPhysicalMaterial color={color} metalness={0.55} roughness={0.2} clearcoat={1} />
    </mesh>
    <mesh position={[0.2, 0.94, 0]}>
      <boxGeometry args={[1.72, 0.42, 1.4]} />
      <meshPhysicalMaterial color="#101820" metalness={0.35} roughness={0.1} transmission={0.08} transparent opacity={0.82} />
    </mesh>
    <mesh position={[1.86, 0.5, 0]}>
      <boxGeometry args={[0.08, 0.17, 1.18]} />
      <meshStandardMaterial color="#f4f7fa" emissive="#ffffff" emissiveIntensity={1.5} />
    </mesh>
    <mesh position={[-1.86, 0.5, 0]}>
      <boxGeometry args={[0.08, 0.17, 1.18]} />
      <meshStandardMaterial color="#e62b2b" emissive="#420707" emissiveIntensity={0.8} />
    </mesh>
    <Wheel position={[1.25, 0.1, 0.82]} /><Wheel position={[-1.25, 0.1, 0.82]} />
    <Wheel position={[1.25, 0.1, -0.82]} /><Wheel position={[-1.25, 0.1, -0.82]} />
    <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.8, 0.08, 1.62]} /><meshStandardMaterial color="#050608" metalness={0.9} /></mesh>
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
