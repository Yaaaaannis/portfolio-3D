import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const ImageCarousel3D = ({ isVisible }) => {
  const groupRef = useRef()
  
  // Chargement des textures
  const textures = useTexture([
    './luugi.jpeg',
    './wawa3.jpeg',
    './dombili.jpeg',
    './wawa3.jpeg',
    './wawa3.jpeg',
  ])

  useFrame(() => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y += 0.01
    }
  })

  useEffect(() => {
    if (isVisible) {
      groupRef.current.scale.set(1, 1, 1)
    } else {
      groupRef.current.scale.set(0, 0, 0)
    }
  }, [isVisible])

  return (
    <group ref={groupRef} position={[-1, 0, 0]} rotation={[0, Math.PI / 2,  Math.PI / 2]}>
      {textures.map((texture, index) => {
        const angle = (index / textures.length) * Math.PI * 2
        const radius = 1
        return (
          <mesh
            key={index}
            position={[
              Math.sin(angle) * radius,
              0,
              Math.cos(angle) * radius
            ]}
            rotation={[0, -angle + Math.PI, 0]}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              map={texture} 
              transparent
              opacity={0.9}
              side={2}
              metalness={0.1}
              roughness={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default ImageCarousel3D 