"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import * as THREE from "three"

function Shape({ position, color, geometryType, scale = 1 }: { position: [number, number, number], color: string, geometryType: "sphere" | "torus" | "icosahedron", scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Rotate slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  const geometry = useMemo(() => {
    switch (geometryType) {
      case "sphere": return <sphereGeometry args={[1, 32, 32]} />
      case "torus": return <torusGeometry args={[1, 0.4, 16, 32]} />
      case "icosahedron": return <icosahedronGeometry args={[1, 0]} />
      default: return <boxGeometry args={[1, 1, 1]} />
    }
  }, [geometryType])

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshPhysicalMaterial 
          color={color}
          roughness={0.2}
          metalness={0.8}
          transmission={0.5}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  )
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        <Environment preset="city" />
        
        <Shape position={[-4, 2, -5]} color="#3b82f6" geometryType="icosahedron" scale={1.5} />
        <Shape position={[5, -3, -8]} color="#eab308" geometryType="torus" scale={2} />
        <Shape position={[-5, -4, -10]} color="#ef4444" geometryType="sphere" scale={1.2} />
        <Shape position={[6, 4, -12]} color="#3b82f6" geometryType="icosahedron" scale={1.8} />
      </Canvas>
    </div>
  )
}
