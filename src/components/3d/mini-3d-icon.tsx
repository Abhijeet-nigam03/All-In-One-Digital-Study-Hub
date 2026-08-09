"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Box, Sphere, Cone, Torus, Environment } from "@react-three/drei"
import * as THREE from "three"

function IconMesh({ type, color }: { type: 'box' | 'sphere' | 'cone' | 'torus', color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
      const targetScale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {type === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {type === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
        {type === 'cone' && <coneGeometry args={[1, 1.5, 32]} />}
        {type === 'torus' && <torusGeometry args={[0.8, 0.3, 16, 32]} />}
        <meshPhysicalMaterial 
          color={hovered ? "#818cf8" : color}
          roughness={0.2}
          metalness={0.8}
          transmission={0.5}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
    </Float>
  )
}

export function Mini3DIcon({ type = 'box', color = '#4338ca' }: { type?: 'box' | 'sphere' | 'cone' | 'torus', color?: string }) {
  return (
    <div className="w-16 h-16 pointer-events-auto cursor-pointer">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <IconMesh type={type} color={color} />
      </Canvas>
    </div>
  )
}
