import React,{useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
export default function DemoCar({color='#cfd4d8',scale=1,spin=true,grounded=false}){
 const group=useRef();
 const paint=useMemo(()=>new THREE.MeshPhysicalMaterial({color,metalness:.62,roughness:.24,clearcoat:1,clearcoatRoughness:.12}),[color]);
 const glass=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#18232c',metalness:.35,roughness:.12,transparent:true,opacity:.92}),[]);
 const rubber=useMemo(()=>new THREE.MeshStandardMaterial({color:'#101114',roughness:.82}),[]);
 const rim=useMemo(()=>new THREE.MeshStandardMaterial({color:'#aeb4ba',metalness:.85,roughness:.2}),[]);
 useFrame((_,delta)=>{if(spin&&group.current)group.current.rotation.y+=delta*.12});
 return <group ref={group} scale={scale} position={[0,grounded?.47*.0:.52,0]}>
  <mesh castShadow receiveShadow material={paint} position={[0,.12,0]}><boxGeometry args={[3.65,.52,1.58,4,2,2]}/></mesh>
  <mesh castShadow material={paint} position={[-.08,.48,0]}><boxGeometry args={[2.12,.58,1.32,3,2,2]}/></mesh>
  <mesh material={glass} position={[-.08,.51,0]}><boxGeometry args={[1.84,.39,1.35]}/></mesh>
  {[-1.2,1.2].map(x=>[-.79,.79].map(z=><group key={`${x}:${z}`} position={[x,-.08,z]} rotation={[Math.PI/2,0,0]}><mesh castShadow material={rubber}><cylinderGeometry args={[.39,.39,.22,32]}/></mesh><mesh material={rim}><cylinderGeometry args={[.23,.23,.235,24]}/></mesh></group>))}
  {[-.55,.55].map(z=><mesh key={z} position={[1.79,.2,z]}><boxGeometry args={[.035,.13,.3]}/><meshStandardMaterial color="#fff1c7" emissive="#c6a66b" emissiveIntensity={.7}/></mesh>)}
 </group>;
}
