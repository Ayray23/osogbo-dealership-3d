const env = import.meta.env;
const digits = (value = '') => String(value).replace(/\D/g, '');
export const shop = {
  name: env.VITE_SHOP_NAME || 'Osogbo Dealership',
  tagline: env.VITE_SHOP_TAGLINE || 'Quality cars for Osogbo and beyond',
  whatsapp: digits(env.VITE_WHATSAPP),
  phone: digits(env.VITE_PHONE),
  email: env.VITE_EMAIL || '',
  address: env.VITE_ADDRESS || 'Osogbo, Osun State, Nigeria',
  mapQuery: env.VITE_MAP_QUERY || env.VITE_ADDRESS || 'Osogbo, Osun State, Nigeria',
  hours: { 0:null, 1:['08:00','18:00'], 2:['08:00','18:00'], 3:['08:00','18:00'], 4:['08:00','18:00'], 5:['08:00','18:00'], 6:['09:00','17:00'] },
  timeZone: 'Africa/Lagos',
};
shop.hasWhatsApp = Boolean(shop.whatsapp); shop.hasPhone = Boolean(shop.phone || shop.whatsapp); shop.contactReady = shop.hasWhatsApp || shop.hasPhone || Boolean(shop.email);
export const whatsappLink = (text) => shop.hasWhatsApp ? `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}` : null;
export const telLink = () => shop.hasPhone ? `tel:+${shop.phone || shop.whatsapp}` : null;
export const mailLink = (subject, body) => shop.email ? `mailto:${shop.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : null;
export const mapsLink = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapQuery)}`;
export const mapsEmbed = () => `https://www.google.com/maps?q=${encodeURIComponent(shop.mapQuery)}&output=embed`;
export function openStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:shop.timeZone,weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(now);
  const get = (type) => parts.find((p)=>p.type===type)?.value; const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
  const minutes=(Number(get('hour'))%24)*60+Number(get('minute')); const toMin=(t)=>Number(t.slice(0,2))*60+Number(t.slice(3)); const today=shop.hours[day];
  if(today&&minutes>=toMin(today[0])&&minutes<toMin(today[1])) return {open:true,label:`Open now · closes ${today[1]}`};
  for(let i=0;i<8;i+=1){const d=(day+i)%7,h=shop.hours[d];if(!h)continue;if(i===0&&minutes>=toMin(h[1]))continue;const name=i===0?'today':i===1?'tomorrow':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d];return {open:false,label:`Closed · opens ${name} ${h[0]}`};}
  return {open:false,label:'Closed'};
}
export const hoursRows = () => { const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; return [1,2,3,4,5,6,0].map((d)=>[names[d],shop.hours[d]?`${shop.hours[d][0]} – ${shop.hours[d][1]}`:'Closed']); };
