import { useEffect, useRef, useState, useMemo } from 'react'
import { Html, Float } from '@react-three/drei'
import gsap from 'gsap'
import './Project1.css'
import { FaGithub } from 'react-icons/fa'
import ProjectModel4 from '../models/ProjectModel4'
import { useFrame } from '@react-three/fiber'

const Project4 = ({ isZoomed }) => {
  const modelRef = useRef()
  const cardRef = useRef()
  const modelsRef = useRef([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState([7, 0, 7.5])

  // Création des positions pour les points d'interrogation d'arrière-plan
  const modelPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 50; i++) {
      positions.push({
        x: -25 + Math.random() * 50,
        y: -20 + Math.random() * 40,
        z: -15 + Math.random() * 50,
        get originalX() { return this.x },
        get originalY() { return this.y },
        rotationX: Math.random() * Math.PI * 4 - Math.PI * 2,
        rotationY: Math.random() * Math.PI * 4 - Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 4 - Math.PI * 2,
        scale: 0.3 + Math.random() * 0.7,
        rotationSpeed: 0.005 + Math.random() * 0.01
      })
    }

    // Vérification des distances minimales entre les points d'interrogation
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x
        const dy = positions[i].y - positions[j].y
        const dz = positions[i].z - positions[j].z
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (distance < 8) {
          positions[j].x += (Math.random() - 0.5) * 10
          positions[j].y += (Math.random() - 0.5) * 10
          positions[j].z += (Math.random() - 0.5) * 10
        }
      }
    }

    return positions
  }, [])

  // Gestion du mouvement de la souris
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

  // Animation des modèles
  useFrame(() => {
    modelsRef.current.forEach((model, index) => {
      if (!model) return
      
      const basePosition = modelPositions[index]
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
      
      model.rotation.y += basePosition.rotationSpeed
    })
  })

  // Animation d'apparition/disparition
  useEffect(() => {
    if (isZoomed) {
      modelsRef.current.forEach((model, index) => {
        if (!model) return
        gsap.fromTo(model.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 0.3,
            y: 0.3,
            z: 0.3,
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
      modelsRef.current.forEach(model => {
        if (model) {
          model.scale.set(0, 0, 0)
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
  }, [isZoomed])

  return (
    <group>
      {modelPositions.map((pos, index) => (
        <group 
          key={index} 
          ref={el => modelsRef.current[index] = el}
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotationX, pos.rotationY, pos.rotationZ]}
          scale={0}
        >
          <Float speed={1.5} rotationIntensity={0.5}>
            <ProjectModel4 isZoomed={isZoomed} />
          </Float>
        </group>
      ))}

      <group ref={modelRef}>
        <Html
          position={[7, 0, -6]}
          rotation={[0, -Math.PI / 2, 0]}
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
            <h2>Projet à venir</h2>
            
            <div className="content-section">
              <p>Ce projet est en cours de développement.
                <br />
                Revenez bientôt pour découvrir les détails !
              </p>
            </div>

            <div className="content-section">
              <h3>Technologies envisagées</h3>
              <p>React, Three.js, WebGL</p>
            </div>

            <div className="buttons-container">
              <button 
                className="interactive-element disabled"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub /> Bientôt disponible
              </button>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

export default Project4 