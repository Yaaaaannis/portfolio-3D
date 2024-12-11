import React, { useRef } from 'react'
import { Float, Text3D, Center } from '@react-three/drei'
import gsap from 'gsap'

function ProjectModel4({ isZoomed, ...props }) {
  const groupRef = useRef()

  return (
    <Float>
      <group
        {...props}
        ref={groupRef}
        dispose={null}
        position={[0, -0.5, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          gsap.to(groupRef.current.rotation, {
            y: '+=0.3',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          })
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'default'
          gsap.to(groupRef.current.rotation, {
            y: 0,
            duration: 0.3,
            ease: 'power1.inOut'
          })
        }}
      >
        <Center position={[0, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={0.7}>
          <Text3D
            font="./fonts/helvetiker_regular.typeface.json"
            size={2}
            height={0.4}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            ?
            <meshStandardMaterial
              color={isZoomed ? "#ff6b6b" : "#4a4a4a"}
              metalness={0.5}
              roughness={0.2}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  )
}

export default ProjectModel4 