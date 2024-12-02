import { useEffect, useRef, useState, useMemo } from 'react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import './Project1.css'
import { FaPlay, FaPause, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Rings = ({ color }) => {
  const ringsCount = 3
  const ringThickness = 0.05

  return (
    <group>
      {[...Array(ringsCount)].map((_, i) => (
        <mesh key={i} rotation-x={Math.PI / 2}>
          <ringGeometry args={[i * 0.3 + 0.5, i * 0.3 + 0.5 + ringThickness, 64]} />
          <meshPhysicalMaterial 
            color={color}
            transparent 
            opacity={0.6}
            metalness={0.5}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

const Project2 = ({ isZoomed }) => {
  const modelRef = useRef()
  const cardRef = useRef()
  const videoRef = useRef()
  const modelsRef = useRef([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const colors = ['#98BBFD', '#734F0F', '#181513']

  const ringPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 100; i++) {
      positions.push({
        x: -35 + Math.random() * 70,
        y: -25 + Math.random() * 50,
        z: -15 + Math.random() * 5,
        get originalX() { return this.x },
        get originalY() { return this.y },
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeed: 0.001 + Math.random() * 0.002,
        scale: 0.8 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    // Vérification des distances minimales
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x
        const dy = positions[i].y - positions[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 8) {
          positions[j].x += (Math.random() - 0.5) * 6
          positions[j].y += (Math.random() - 0.5) * 6
        }
      }
    }

    return positions
  }, [])

  const handleVideoToggle = (e) => {
    e.stopPropagation()
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    modelsRef.current.forEach((model, index) => {
      if (!model) return
      
      const basePosition = ringPositions[index]
      
      const dx = basePosition.originalX - (mousePosition.x * 15)
      const dy = basePosition.originalY - (mousePosition.y * 15)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const radius = 8
      
      if (distance < radius) {
        const force = (1 - distance / radius) * 1.5
        const angle = Math.atan2(dy, dx)
        
        model.position.x = basePosition.originalX + Math.cos(angle) * force
        model.position.y = basePosition.originalY + Math.sin(angle) * force
      } else {
        model.position.x += (basePosition.originalX - model.position.x) * 0.1
        model.position.y += (basePosition.originalY - model.position.y) * 0.1
      }
      
      // Rotation douce et continue
      model.rotation.x += basePosition.rotationSpeed
      model.rotation.y += basePosition.rotationSpeed * 1.2
      model.rotation.z += basePosition.rotationSpeed * 0.8

      // Légère ondulation en Z
      model.position.z += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.001
    })
  })

  useEffect(() => {
    if (isZoomed) {
      // Réinitialiser toutes les échelles à 0 avant de démarrer les nouvelles animations
      modelsRef.current.forEach(model => {
        if (model) {
          model.scale.set(0, 0, 0)
        }
      })

      // Killer toutes les animations GSAP en cours
      gsap.killTweensOf(modelsRef.current.map(ref => ref?.scale))
      gsap.killTweensOf(cardRef.current)

      // Démarrer les nouvelles animations
      modelsRef.current.forEach((model, index) => {
        if (!model) return
        
        gsap.fromTo(model.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: ringPositions[index].scale,
            y: ringPositions[index].scale,
            z: ringPositions[index].scale,
            duration: 0.8,
            delay: index * 0.05,
            ease: "elastic.out(1, 0.5)"
          }
        )
      })

      gsap.fromTo(cardRef.current,
        { 
          opacity: 0,
          scale: 0.9,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2
        }
      )
    } else {
      // Killer toutes les animations en cours
      gsap.killTweensOf(modelsRef.current.map(ref => ref?.scale))
      gsap.killTweensOf(cardRef.current)

      // Réinitialiser immédiatement toutes les échelles
      modelsRef.current.forEach(model => {
        if (model) {
          gsap.to(model.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.4,
            ease: "power2.in"
          })
        }
      })

      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.4,
        ease: "power2.in"
      })
    }
  }, [isZoomed, ringPositions])

  return (
    <group>
      {ringPositions.map((pos, index) => (
        <group 
          key={index} 
          ref={el => modelsRef.current[index] = el}
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotationX, pos.rotationY, pos.rotationZ]}
          scale={0}
        >
          <Rings color={pos.color} />
        </group>
      ))}

      <group ref={modelRef}>
        <Html
             position={[-7, 0, 8]}
             rotation={[ 0, Math.PI / 2, 0]}
          transform
          occlude={false}
          style={{
            transition: 'all 0.2s',
            opacity: isZoomed ? 1 : 0,
            transform: `scale(${isZoomed ? 1 : 0.5})`,
            pointerEvents: isZoomed ? 'auto' : 'none'
          }}
        >
          <div className="project-card" ref={cardRef}>
            <h2>Roaster BMS</h2>
            
            <div className="video-container">
              <video
                ref={videoRef}
                src="./bms.mp4"
                loop
                muted
                className="project-video"
              />
              <button 
                className="video-control"
                onClick={handleVideoToggle}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>

            <div className="content-section">
              <p>Projet personnel pour présenter le Roaster de BMS et leurs maillots en 3D</p>
            </div>

            <div className="content-section">
              <h3>Technologies utilisées</h3>
              <p>React, Three.js, GSAP</p>
            </div>

            <div className="buttons-container">
              <button 
                className="interactive-element"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open('https://github.com/Yaaaaannis/bms', '_blank')
                }}
              >
                <FaGithub /> Code
              </button>
              <button 
                className="interactive-element"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open('https://bms-eosin.vercel.app/', '_blank')
                }}
              >
                <FaExternalLinkAlt /> Demo
              </button>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

export default Project2