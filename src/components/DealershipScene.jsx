import React, { Suspense, useMemo, useState } from 'react';
import { Environment, Float, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { cars } from '../data/inventory';
import ResilientGLBVehicle from './ResilientGLBVehicle';
import DemoCar from './DemoCar';

export const VIEWS = {
  hero: { label:'Hero', position:[7,3.2,8], target:[0,0.7,0], hidden:true },
  outside: { label:'Forecourt', position:[9,3.8,10], target:[0,0.6,0] },
  entrance: { label:'Entrance', position:[6,2.8,6], target:[0,0.7,0] },
  floor: { label:'Showroom floor', position:[0,3.2,9], target:[0,0.7,0] },
};

function Vehicle({ car, position, scale=1, onClick }) {
  return <group position={position} onClick={(e)=>{e.stopPropagation();onClick?.(car);}}>
    <Suspense fallback={<DemoCar color={car.color} scale={scale}/>}>{car.modelUrl ? <ResilientGLBVehicle modelUrl={car.modelUrl} color={car.color} scale={scale} autoRotate={false} fallback={<DemoCar color={car.color} scale={scale}/>} /> : <DemoCar color={car.color} scale={scale}/>}</Suspense>
  </group>;
}

export default function DealershipScene({ view='hero', onSelectCar, lite=false, offsetX=0 }) {
  const [hovered,setHovered]=useState(null);
  const camera=VIEWS[view]||VIEWS.hero;
  const positions=useMemo(()=>[[-3.5,-0.55,0],[0,-0.55,-0.7],[3.5,-0.55,0],[-2,-0.55,-3.2],[2,-0.55,-3.2],[0,-0.55,-5.1]],[ ]);
  return <>
    <color attach="background" args={['#050607']} />
    <fog attach="fog" args={['#050607',10,28]} />
    <PerspectiveCamera makeDefault position={[camera.position[0]+offsetX,camera.position[1],camera.position[2]]} fov={42}/>
    <ambientLight intensity={0.55}/><spotLight position={[4,8,4]} intensity={120} angle={0.55} penumbra={0.8} castShadow/><spotLight position={[-5,5,-2]} intensity={70} color="#809cff" angle={0.7} penumbra={1}/>
    <Environment preset="city" />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.65,0]} receiveShadow><planeGeometry args={[35,35]}/><meshStandardMaterial color="#0b0d0f" roughness={0.24} metalness={0.35}/></mesh>
    <mesh position={[0,3,-6]}><boxGeometry args={[22,7,0.2]}/><meshStandardMaterial color="#090b0d" roughness={0.75}/></mesh>
    {!lite && <><mesh position={[0,1.9,-5.8]}><boxGeometry args={[12,3.8,0.08]}/><meshStandardMaterial color="#12161a" roughness={0.5} metalness={0.2}/></mesh><Text position={[0,3.1,-5.72]} fontSize={0.48} color="#d7ad67" anchorX="center">OSOGBO DEALERSHIP</Text></>}
    {cars.map((car,i)=><Float key={car.id} speed={0.7+i*0.04} floatIntensity={0.03} rotationIntensity={0.02}><Vehicle car={car} position={positions[i]} scale={lite?0.7:0.62} onClick={onSelectCar}/></Float>)}
    {hovered && <Text position={[0,2.5,0]} fontSize={0.22} color="#f2d79f" anchorX="center">{hovered.name}</Text>}
    <OrbitControls enablePan={false} minDistance={5.5} maxDistance={15} minPolarAngle={Math.PI*0.27} maxPolarAngle={Math.PI*0.53} target={camera.target}/>
  </>;
}
