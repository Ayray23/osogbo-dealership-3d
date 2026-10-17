/** Nigerian-market sample inventory. Verify actual stock, condition and price with the dealership before launch. */
const BASE = 'https://cdn.jsdelivr.net/gh/pedrosoandre/carros@0a56de377f02f2574d781f6920fed08d6423ec2f/assets/';
export const cars = [
  { id:'camry-xv40', name:'Toyota Camry 3.5 (XV40)', year:'2006–2011', priceNgn:null, status:'available', category:'Sedan', color:'#cfd4d8', fuel:'Petrol', transmission:'Automatic', drive:'FWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}toyota-camry.glb` },
  { id:'lexus-rx350', name:'Lexus RX 350 (MK2)', year:'2003–2008', priceNgn:null, status:'available', category:'SUV', color:'#15171b', fuel:'Petrol', transmission:'Automatic', drive:'AWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}lexus-rx.glb` },
  { id:'rav4-hybrid', name:'Toyota RAV4 Hybrid', year:'2021', priceNgn:null, status:'available', category:'SUV', color:'#b7b1a5', fuel:'Hybrid', transmission:'Automatic', drive:'AWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}toyota-rav4.glb` },
  { id:'crv-turbo', name:'Honda CR-V 1.5 Turbo', year:'2025', priceNgn:null, status:'available', category:'SUV', color:'#e5e6e8', fuel:'Petrol', transmission:'Automatic', drive:'AWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}honda-cr-v.glb` },
  { id:'elantra-n', name:'Hyundai Elantra N', year:'2021–2023', priceNgn:null, status:'available', category:'Sedan', color:'#111317', fuel:'Petrol', transmission:'Automatic', drive:'FWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}hyundai-elantra.glb` },
  { id:'corolla-cross', name:'Toyota Corolla Cross', year:'2021+', priceNgn:null, status:'available', category:'SUV', color:'#25282b', fuel:'Petrol', transmission:'Automatic', drive:'FWD', condition:'Foreign Used', yaw:0, modelUrl:`${BASE}toyota-corolla-cross.glb` },
];
export const STATUS_LABEL = { available:'Available', reserved:'Reserved', sold:'Sold', incoming:'Arriving soon' };
export const formatPrice = (car) => (car.priceNgn ? `₦${Number(car.priceNgn).toLocaleString('en-NG')}` : 'Ask for price');
