"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function AnimatedBlob() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      
      // Interactive scaling
      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <MeshDistortMaterial
          color={hovered ? "#3b82f6" : "#2563eb"}
          emissive="#1e3a8a"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  )
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-auto" />
  }

  return (
    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#3b82f6", "#0f172a", 0.8]} />
        <directionalLight position={[2, 2, 5]} intensity={1.8} color="#3b82f6" />
        <pointLight position={[-2, -2, -2]} intensity={2.5} color="#ef4444" />
        <pointLight position={[2, -2, 2]} intensity={2.5} color="#eab308" />
        
        {/* Main interactive blob in the center */}
        <AnimatedBlob />

        <Float speed={3} floatIntensity={3} position={[-4, 3, -3]}>
          <Sphere args={[0.3, 32, 32]}>
             <meshStandardMaterial color="#ef4444" transparent opacity={0.6} roughness={0.1} />
          </Sphere>
        </Float>
        <Float speed={1.5} floatIntensity={2} position={[4, -2, -4]}>
          <Sphere args={[0.5, 32, 32]}>
             <meshStandardMaterial color="#7f1d1d" transparent opacity={0.6} roughness={0.1} />
          </Sphere>
        </Float>
        <Float speed={2} floatIntensity={4} position={[-3, -3, -5]}>
          <Sphere args={[0.4, 32, 32]}>
             <meshStandardMaterial color="#b91c1c" transparent opacity={0.6} roughness={0.1} />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  )
}
