import React, { Suspense, useMemo } from 'react';
import { Environment, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { cars } from '../data/inventory';
import ResilientGLBVehicle from './ResilientGLBVehicle';
import DemoCar from './DemoCar';

export const VIEWS = {
  hero: { label:'Showroom', position:[11,5.2,13], target:[0,1.2,-1], hidden:true },
  outside: { label:'Forecourt', position:[15,5.5,17], target:[0,1.4,-1] },
  entrance: { label:'Entrance', position:[9,4.2,12], target:[0,1.5,-2] },
  floor: { label:'Showroom', position:[0,4.6,13], target:[0,1.1,-2] },
};

const displays = [
  [-5.3,0.18,-2.2,0.15],[0,0.18,-3.0,0],[5.3,0.18,-2.2,-0.15],
  [-5.3,0.18,-8.0,0.15],[0,0.18,-9.0,0],[5.3,0.18,-8.0,-0.15],
];

function Vehicle({ car, position, rotation=0, scale=1, onClick }) {
  return <group position={position} rotation={[0,rotation,0]} onClick={(e)=>{e.stopPropagation();onClick?.(car);}}>
    <Suspense fallback={<DemoCar color={car.color} scale={scale}/>}>{car.modelUrl ? <ResilientGLBVehicle modelUrl={car.modelUrl} color={car.color} scale={scale} autoRotate={false} fallback={<DemoCar color={car.color} scale={scale}/>} /> : <DemoCar color={car.color} scale={scale}/>}</Suspense>
  </group>;
}

function GlassWall({position,args}){return <mesh position={position}><boxGeometry args={args}/><meshPhysicalMaterial color="#cbd8dc" transparent opacity={0.16} roughness={0.08} metalness={0.05} transmission={0.35} thickness={0.08}/></mesh>}
function Pillar({position}){return <mesh position={position} castShadow><boxGeometry args={[0.22,4.8,0.22]}/><meshStandardMaterial color="#d7d9da" metalness={0.65} roughness={0.25}/></mesh>}
function CeilingLight({position}){return <group position={position}><mesh><boxGeometry args={[2.2,0.08,0.28]}/><meshStandardMaterial color="#f5f4ef" emissive="#fff4d8" emissiveIntensity={2}/></mesh><pointLight intensity={4.5} distance={9} color="#fff1d2"/></group>}
function CarPlinth({position}){return <mesh position={position} receiveShadow><cylinderGeometry args={[2.25,2.25,0.16,64]}/><meshStandardMaterial color="#d8d8d6" roughness={0.3} metalness={0.12}/></mesh>}

export default function DealershipScene({ view='hero', onSelectCar, lite=false, offsetX=0 }) {
  const camera=VIEWS[view]||VIEWS.hero;
  const positions=useMemo(()=>displays,[ ]);
  return <>
    <color attach="background" args={['#dfe5e7']} />
    <fog attach="fog" args={['#dfe5e7',22,48]} />
    <PerspectiveCamera makeDefault position={[camera.position[0]+offsetX,camera.position[1],camera.position[2]]} fov={45}/>
    <ambientLight intensity={1.5}/><directionalLight position={[-8,12,8]} intensity={4.2} castShadow shadow-mapSize={[1024,1024]} />
    <Environment preset="city" background={false} />

    {/* Real dealership architecture: polished floor, glass frontage, steel frame, ceiling and service/reception zones. */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow><planeGeometry args={[30,30]}/><meshPhysicalMaterial color="#e4e3df" roughness={0.2} metalness={0.08}/></mesh>
    <mesh position={[0,4,-10]}><boxGeometry args={[24,8,0.35]}/><meshStandardMaterial color="#f0f1f0" roughness={0.7}/></mesh>
    <GlassWall position={[-8,3,-4]} args={[0.12,6,12]} /><GlassWall position={[8,3,-4]} args={[0.12,6,12]} />
    <GlassWall position={[0,3,3.8]} args={[16,6,0.12]} />
    <GlassWall position={[-8,3,-10]} args={[0.12,6,8]} /><GlassWall position={[8,3,-10]} args={[0.12,6,8]} />
    {[-7.7,-3.85,0,3.85,7.7].map((x)=><Pillar key={x} position={[x,2.4,-9.75]}/>)}
    <mesh position={[0,5.9,-4]}><boxGeometry args={[20,0.2,12]}/><meshStandardMaterial color="#c7c9c8" roughness={0.55}/></mesh>
    {[[-5,5,-2],[0,5,-2],[5,5,-2],[-5,5,-7],[0,5,-7],[5,5,-7]].map((p,i)=><CeilingLight key={i} position={p}/>)}

    {/* Reception / consultation zone */}
    <mesh position={[0,0.55,1.9]} castShadow><boxGeometry args={[4.8,1.1,1.05]}/><meshStandardMaterial color="#5d6265" roughness={0.3}/></mesh>
    <mesh position={[0,1.18,1.9]}><boxGeometry args={[4.1,0.08,0.9]}/><meshStandardMaterial color="#d5b274" metalness={0.5} roughness={0.22}/></mesh>
    <Text position={[0,1.55,1.34]} rotation={[0,0,0]} fontSize={0.28} color="#262b2d" anchorX="center">OSOGBO DEALERSHIP</Text>
    <mesh position={[-5.9,0.35,2.2]} castShadow><boxGeometry args={[2.6,0.7,1.5]}/><meshStandardMaterial color="#2d3336" roughness={0.42}/></mesh>
    <mesh position={[-5.9,0.75,2.2]}><boxGeometry args={[2.15,0.05,1.2]}/><meshStandardMaterial color="#b8a47d" roughness={0.25}/></mesh>
    <Text position={[-5.9,1.12,1.4]} fontSize={0.22} color="#50565a" anchorX="center">SALES & FINANCE</Text>

    {/* Vehicle display plinths and natural showroom spacing */}
    {positions.map((p,i)=><React.Fragment key={cars[i].id}><CarPlinth position={[p[0],0.08,p[2]]}/><Vehicle car={cars[i]} position={p.slice(0,3)} rotation={p[3]} scale={lite?0.72:0.82} onClick={onSelectCar}/></React.Fragment>)}

    {/* Exterior forecourt visible through the glass */}
    <mesh position={[0,-0.05,7]} receiveShadow><boxGeometry args={[24,0.1,7]}/><meshStandardMaterial color="#777b7b" roughness={0.72}/></mesh>
    {[-6,0,6].map((x)=><mesh key={x} position={[x,0.02,6.1]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[4.8,0.14]}/><meshBasicMaterial color="#f4f4f1"/></mesh>)}
    <Text position={[0,3.6,-9.55]} fontSize={0.62} color="#34393b" anchorX="center">OSOGBO DEALERSHIP</Text>
    <Text position={[0,3.02,-9.52]} fontSize={0.18} color="#74797b" anchorX="center">PRE-OWNED · QUALITY CHECKED · READY TO VIEW</Text>

    <OrbitControls enablePan={false} minDistance={7} maxDistance={23} minPolarAngle={Math.PI*0.22} maxPolarAngle={Math.PI*0.55} target={camera.target} enableDamping dampingFactor={0.08} rotateSpeed={0.48} />
  </>;
}
