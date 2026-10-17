import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ExternalLink, Mail, MapPin, MessageCircle, Phone, X } from 'lucide-react';
import { hoursRows, mapsEmbed, mapsLink, openStatus, shop, telLink, whatsappLink } from '../config/shop';

export function useDealerSchema() {
  useMemo(() => {
    if (typeof document === 'undefined') return null;
    const id='osogbo-dealership-schema';
    let node=document.getElementById(id);
    if(!node){node=document.createElement('script');node.id=id;node.type='application/ld+json';document.head.appendChild(node);}
    node.textContent=JSON.stringify({ '@context':'https://schema.org','@type':'AutoDealer',name:shop.name,address:{'@type':'PostalAddress',addressLocality:'Osogbo',addressRegion:'Osun State',addressCountry:'NG'},url:window.location.href});
    return null;
  },[]);
}

export function EnquiryModal({ car, onClose }) {
  const message=`Hello ${shop.name}, I am interested in the ${car.name} (${car.year}). Is it available?`;
  const wa=whatsappLink(message); const mail=shop.email ? `mailto:${shop.email}?subject=${encodeURIComponent(`Enquiry: ${car.name}`)}&body=${encodeURIComponent(message)}` : null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="form-card"><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button><span className="eyebrow">VEHICLE ENQUIRY</span><h2>{car.name}</h2><p>{car.year} · {car.condition}. Confirm current stock and price directly with the dealership.</p><div className="visit-actions">{wa&&<a className="primary" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>}{mail&&<a className="secondary" href={mail}><Mail size={16}/> Email</a>}</div>{!wa&&!mail&&<p className="config-notice">Contact details have not been configured yet. Add <code>VITE_WHATSAPP</code> or <code>VITE_EMAIL</code> in the deployment environment.</p>}</div></div>;
}

export function BookingSection({ initialCar }) {
  const [sent,setSent]=useState(false); const [form,setForm]=useState({name:'',phone:'',date:'',time:'',car:initialCar||''});
  const submit=(e)=>{e.preventDefault();const car=initialCar||form.car||'a vehicle';const text=`Hello ${shop.name}, I would like to book a viewing for ${car}. Name: ${form.name}. Phone: ${form.phone}. Date: ${form.date}. Time: ${form.time}.`;const link=whatsappLink(text);if(link)window.open(link,'_blank','noopener,noreferrer');else if(shop.email)window.location.href=`mailto:${shop.email}?subject=${encodeURIComponent('Viewing request')}&body=${encodeURIComponent(text)}`;setSent(true);};
  return <section id="book" className="booking"><div className="booking-copy"><span className="eyebrow">BOOK A VIEWING</span><h2>See it in person<br/><em>in Osogbo.</em></h2><p>Choose a time and send the request directly to the dealership. This form does not reserve a vehicle until the team confirms it.</p></div><form className="booking-card" onSubmit={submit}><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><div className="booking-row"><label>Phone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Date<input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Time<input required type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label></div><label>Vehicle<select value={initialCar||form.car} onChange={e=>setForm({...form,car:e.target.value})}><option value="">Any available vehicle</option></select></label><button className="primary" type="submit"><CalendarDays size={16}/> Send viewing request</button>{sent&&<p className="booking-sent"><CheckCircle2 size={16}/> Request prepared. The dealership should confirm the appointment.</p>}{!shop.contactReady&&<p className="config-notice">Add the dealership's verified WhatsApp, phone or email before launch.</p>}</form></section>;
}

export function VisitSection() {
  const status=openStatus();
  return <section id="visit" className="visit"><div><span className="eyebrow">FIND THE DEALERSHIP</span><h2>Come see the cars<br/><em>in Osogbo.</em></h2><p className="visit-address"><MapPin size={17}/>{shop.address}</p><p className={`open-status ${status.open?'is-open':''}`}>{status.open?'● ':''}{status.label}</p><table className="hours"><tbody>{hoursRows().map(([d,h])=><tr key={d}><th>{d}</th><td>{h}</td></tr>)}</tbody></table><div className="visit-actions">{telLink()&&<a className="secondary" href={telLink()}><Phone size={16}/> Call</a>}{shop.email&&<a className="secondary" href={`mailto:${shop.email}`}><Mail size={16}/> Email</a>}<a className="primary" href={mapsLink()} target="_blank" rel="noreferrer"><MapPin size={16}/> Open map <ExternalLink size={13}/></a></div></div><div className="visit-map"><iframe title="Osogbo Dealership map" src={mapsEmbed()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>;
}

export function WhatsAppFab(){const link=whatsappLink(`Hello ${shop.name}, I would like to enquire about a vehicle.`);return link?<a className="wa-fab" href={link} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle/></a>:null;}
