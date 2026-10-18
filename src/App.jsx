import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { ArrowRight, CarFront, CheckCircle2, MapPin, Menu, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import ResilientGLBVehicle from './components/ResilientGLBVehicle';
import VehicleInspector from './components/VehicleInspector';
import DemoCar from './components/DemoCar';
import DealershipScene, { VIEWS } from './components/DealershipScene';
import { EnquiryModal, BookingSection, VisitSection, WhatsAppFab, useDealerSchema } from './components/ShopSections';
import { cars, formatPrice, STATUS_LABEL } from './data/inventory';
import { shop } from './config/shop';
import './styles.css';
import './shop.css';
import './loading.css';

class ModelErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('3D vehicle model failed to load; using fallback preview.', error); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function ProgressiveSection({ id, minHeight, skeleton, children }) {
  const sectionRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) { setReady(true); return undefined; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '420px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={sectionRef} id={id} className={`progressive-section ${ready ? 'is-ready' : ''}`} aria-busy={!ready}>
    {ready ? children : <div className={`section-skeleton skeleton-${skeleton}`} style={{ minHeight }} aria-hidden="true"><div className="skeleton-glow" />
      {skeleton === 'hero' && <><div className="skeleton-hero-copy"><i /><b /><b /><span /><span /><span /></div><div className="skeleton-hero-stage"><div className="skeleton-car-shape" /></div></>}
      {skeleton === 'inventory' && <><div className="skeleton-heading"><i /><b /><span /></div><div className="skeleton-card-grid">{[0,1,2,3,4,5].map((n) => <div className="skeleton-car-card" key={n}><div /><i /><b /><span /><span /></div>)}</div></>}
      {skeleton === 'strip' && <div className="skeleton-strip-items"><span /><span /><span /></div>}
      {skeleton === 'experience' && <><div className="skeleton-experience-copy"><i /><b /><b /><span /><span /></div><div className="skeleton-experience-stage"><div className="skeleton-car-shape" /></div></>}
      {skeleton === 'finance' && <><div className="skeleton-finance-copy"><i /><b /><b /><span /><span /></div><div className="skeleton-finance-card"><span /><span /><span /><b /></div></>}
      {skeleton === 'footer' && <div className="skeleton-footer-items"><span /><span /><span /></div>}
    </div>}
  </div>;
}

function VehicleDisplay({ car, scale = 1, autoRotate = true }) {
  return car?.modelUrl ? <ResilientGLBVehicle modelUrl={car.modelUrl} color={car.color} scale={scale} autoRotate={autoRotate} fallback={<DemoCar color={car.color} scale={scale} />} /> : <DemoCar color={car?.color} scale={scale} />;
}

function ViewSwitcher({ view, onChange }) {
  return <div className="view-switcher" role="group" aria-label="Camera position">
    {Object.entries(VIEWS).filter(([, v]) => !v.hidden).map(([key, v]) => <button key={key} type="button" className={view === key ? 'active' : ''} onClick={() => onChange(key)}>{v.label}</button>)}
  </div>;
}

function CarCard({ car, onView, onBook }) {
  const ref = useRef();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return undefined;
    if (!('IntersectionObserver' in window)) { setReady(true); return undefined; }
    const o = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setReady(true); o.disconnect(); } }, { rootMargin: '180px' });
    o.observe(ref.current); return () => o.disconnect();
  }, []);
  const status = car.status || 'available';
  return <article className="car-card"><div className="card-visual" ref={ref}>
    {ready ? <Canvas dpr={1} camera={{ position: [4.5, 2.1, 4.5], fov: 42 }} gl={{ antialias: false, alpha: true }} performance={{ min: 0.5, max: 1 }}>
      <ambientLight intensity={1.15} /><directionalLight position={[4, 5, 3]} intensity={2} />
      <Suspense fallback={<Html center><div className="model-skeleton" role="status" aria-label="Loading 3D vehicle"><span /></div></Html>}><ModelErrorBoundary fallback={<Html center><div className="model-unavailable" role="status"><CarFront size={22} /><span>3D preview unavailable</span></div></Html>}><VehicleDisplay car={car} scale={0.78} /></ModelErrorBoundary></Suspense>
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.65} enableDamping dampingFactor={0.08} />
    </Canvas> : <div className="preview-placeholder" role="img" aria-label={`${car.name} 3D preview loading`}><CarFront size={30} /><span>Interactive 3D preview</span></div>}
    <span className="condition">3D Preview</span><span className={`status-badge status-${status}`}>{STATUS_LABEL[status]}</span>
  </div><div className="card-copy"><span className="year">{car.year}</span><h3>{car.name}</h3><p>{car.category} · {car.condition}</p>
    <div className="spec-row"><span>{car.fuel}</span><span>{car.transmission}</span><span>{car.drive}</span></div>
    <div className="card-bottom"><strong>{formatPrice(car)}</strong><button onClick={() => onView(car)}>View details <ArrowRight size={15} /></button></div>
    {status !== 'sold' && <button className="card-book" onClick={() => onBook(car)}>Book a viewing</button>}
  </div></article>;
}

function ShowroomCanvas({ view, onSelectCar }) { return <Canvas shadows dpr={[1, 1.25]} gl={{ powerPreference: 'high-performance' }} performance={{ min: 0.5, max: 1 }}><DealershipScene view={view} onSelectCar={onSelectCar} /></Canvas>; }

export default function App() {
  useDealerSchema();
  const [menu, setMenu] = useState(false); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null); const [showroom, setShowroom] = useState(false); const [enquiry, setEnquiry] = useState(null); const [bookCar, setBookCar] = useState(null);
  const [stageView, setStageView] = useState('floor'); const [modalView, setModalView] = useState('outside');
  const [finance, setFinance] = useState({ price: 15000000, deposit: 3000000, months: 36 });
  const filtered = cars.filter((c) => (category === 'All' || c.category === category) && c.name.toLowerCase().includes(query.toLowerCase()));
  const loan = Math.max(0, finance.price - finance.deposit); const monthly = loan / finance.months;
  const openFromShowroom = (car) => { setShowroom(false); setSelected(car); };
  const bookThis = (car) => { setBookCar(car.id); setSelected(null); setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }), 50); };
  return <div className="site-shell">
    <header className="topbar"><a className="brand" href="#top">{shop.name.split(' ')[0].toUpperCase()}<span>{shop.name.split(' ').slice(1).join(' ').toUpperCase()}</span></a>
      <nav className={menu ? 'nav open' : 'nav'}><a href="#inventory" onClick={() => setMenu(false)}>Inventory</a><a href="#experience" onClick={() => setMenu(false)}>3D Showroom</a><a href="#book" onClick={() => setMenu(false)}>Book a viewing</a><a href="#finance" onClick={() => setMenu(false)}>Finance</a><a href="#visit" onClick={() => setMenu(false)}>Visit us</a></nav>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
    </header>
    <main id="top">
      <ProgressiveSection minHeight={720} skeleton="hero"><section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> OSOGBO · OSUN STATE</span><h1>Walk into the<br /><em>showroom</em> from anywhere.</h1><p>{shop.tagline}. Tour the dealership floor in 3D, inspect every car, then book a viewing or message the team on WhatsApp.</p><div className="hero-actions"><a href="#inventory" className="primary">Explore inventory <ArrowRight size={16} /></a><button className="secondary" onClick={() => setShowroom(true)}>Enter 3D showroom <Sparkles size={16} /></button></div><div className="hero-meta"><span><ShieldCheck size={15} /> Inspect before you buy</span><span><MapPin size={15} /> {shop.address}</span></div></div><div className="hero-canvas"><Canvas shadows dpr={[1, 1.25]} performance={{ min: 0.5, max: 1 }}><DealershipScene lite view="hero" offsetX={0.2} /></Canvas><div className="canvas-note">DRAG · ROTATE · EXPLORE</div></div></section></ProgressiveSection>
      <ProgressiveSection id="inventory" minHeight={900} skeleton="inventory"><section className="inventory"><div className="section-head"><div><span className="eyebrow">CURRENT COLLECTION</span><h2>Selected vehicles.</h2></div><div className="filters"><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles" /></div><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category"><option>All</option><option>Sedan</option><option>SUV</option></select></div></div><div className="car-grid">{filtered.map((car) => <CarCard key={car.id} car={car} onView={setSelected} onBook={bookThis} />)}</div>{filtered.length === 0 && <p className="no-results">No cars match that search.</p>}</section></ProgressiveSection>
      <ProgressiveSection minHeight={190} skeleton="strip"><section className="trust-strip"><div><ShieldCheck /><strong>Vehicle-first experience</strong><span>Inspect before you enquire.</span></div><div><MapPin /><strong>Osogbo dealership</strong><span>Built around local buyers.</span></div><div><CheckCircle2 /><strong>Transparent enquiry</strong><span>Confirm stock and price directly.</span></div></section></ProgressiveSection>
      <ProgressiveSection id="experience" minHeight={560} skeleton="experience"><section className="experience"><div className="experience-copy"><span className="eyebrow">THE 3D SHOWROOM</span><h2>Step inside the<br /><em>dealership.</em></h2><p>Start on the forecourt, walk through the glass doors, and browse the cars on the showroom floor. Tap any car to inspect it.</p><button className="primary" onClick={() => setShowroom(true)}>Open full screen <ArrowRight size={16} /></button></div><div className="experience-stage"><Canvas shadows dpr={[1, 1.25]} performance={{ min: 0.5, max: 1 }}><DealershipScene view={stageView} onSelectCar={setSelected} /></Canvas><ViewSwitcher view={stageView} onChange={setStageView} /><div className="canvas-note">REAL-TIME 3D · TAP A CAR</div></div></section></ProgressiveSection>
      <BookingSection initialCar={bookCar} />
      <ProgressiveSection id="finance" minHeight={560} skeleton="finance"><section className="finance"><div><span className="eyebrow">PLANNING YOUR PURCHASE</span><h2>Estimate a<br /><em>monthly plan.</em></h2><p>This is an illustrative calculator, not a financing offer. Confirm deposit, rates, fees and eligibility with the dealership or lender.</p></div><div className="finance-card"><label className="budget-control">Vehicle budget <strong>₦{finance.price.toLocaleString()}</strong><div className="budget-input-row"><span>₦</span><input className="budget-amount-input" aria-label="Type your vehicle budget in naira" type="number" min="0" step="1" value={finance.price} onChange={(e) => { const price = Math.max(0, Number(e.target.value) || 0); setFinance({ ...finance, price, deposit: Math.min(finance.deposit, price * 0.8) }); }} /></div><input aria-label="Drag to change vehicle budget" type="range" min="0" max={Math.max(100000000, finance.price)} step="100000" value={finance.price} onChange={(e) => { const price = +e.target.value; setFinance({ ...finance, price, deposit: Math.min(finance.deposit, price * 0.8) }); }} /><small>Drag the slider or type any amount in naira.</small></label><label>Deposit <strong>₦{finance.deposit.toLocaleString()}</strong><input type="range" min="0" max={Math.max(0, finance.price * 0.8)} step="100000" value={Math.min(finance.deposit, finance.price * 0.8)} onChange={(e) => setFinance({ ...finance, deposit: +e.target.value })} /></label><label>Term <strong>{finance.months} months</strong><input type="range" min="6" max="60" step="6" value={finance.months} onChange={(e) => setFinance({ ...finance, months: +e.target.value })} /></label><div className="estimate"><span>Illustrative monthly principal</span><strong>₦{Math.round(monthly).toLocaleString()}</strong></div></div></section></ProgressiveSection>
      <VisitSection />
    </main>
    <footer id="contact"><div><a className="brand" href="#top">{shop.name.split(' ')[0].toUpperCase()}<span>{shop.name.split(' ').slice(1).join(' ').toUpperCase()}</span></a><p>{shop.tagline}.</p></div><div className="footer-contact"><span>VISIT</span><strong>{shop.address}</strong></div><div className="asset-credits"><span>3D MODEL CREDITS · CC BY 4.0</span><p>Optimized web models supplied by <a href="https://github.com/pedrosoandre/carros" target="_blank" rel="noreferrer">carros</a>. Original creators and source links are retained in the project README. These previews are representative; confirm actual stock, condition and price with the dealership.</p></div><div className="copyright">© {new Date().getFullYear()} {shop.name} · Built for Nigeria</div></footer>
    <WhatsAppFab />
    {showroom && <div className="showroom-modal"><button className="modal-close" onClick={() => setShowroom(false)} aria-label="Close showroom"><X /></button><div className="modal-title"><span>FULL SHOWROOM</span><strong>Explore the dealership</strong></div><ShowroomCanvas view={modalView} onSelectCar={openFromShowroom} /><ViewSwitcher view={modalView} onChange={setModalView} /><div className="canvas-note">DRAG · ROTATE · TAP A CAR TO INSPECT</div></div>}
    {selected && <VehicleInspector car={selected} onClose={() => setSelected(null)} onEnquire={(car) => { setSelected(null); setEnquiry(car); }} />}
    {enquiry && <EnquiryModal car={enquiry} onClose={() => setEnquiry(null)} />}
  </div>;
}
