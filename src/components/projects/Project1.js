import { useEffect, useRef, useState, useMemo } from 'react'
import { Html, Float } from '@react-three/drei'
import gsap from 'gsap'
import './Project1.css'
import { FaPlay, FaPause, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import ProjectModel1 from '../models/ProjectModel1'
import { useFrame } from '@react-three/fiber'
const Project1 = ({ isZoomed }) => {
  const modelRef = useRef()
  const cardRef = useRef()
  const videoRef = useRef()
  const modelsRef = useRef([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Création d'un tableau de positions fixes pour les modèles
  const modelPositions = useMemo(() => {
    const positions = []
    // Création de positions plus aléatoires
    for (let i = 0; i < 50; i++) {  // 12 cannettes au total
      positions.push({
        // Position X : entre -25 et 25 (toute la largeur)
        x: -25 + Math.random() * 50,
        // Position Y : entre -15 et 15 (toute la hauteur)
        y: -15 + Math.random() * 30,
        // Position Z : entre -10 et -9.7
        z: -10 + Math.random() * 0.3,
        // On garde les positions originales pour le retour après mouvement souris
        get originalX() { return this.x },
        get originalY() { return this.y },
        // Rotations initiales aléatoires
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        // Vitesse de rotation fixe
        rotationSpeed: 0.01
      })
    }

    // Vérification des distances minimales entre les cannettes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x
        const dy = positions[i].y - positions[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Si deux cannettes sont trop proches (moins de 5 unités)
        if (distance < 5) {
          // On ajuste légèrement leur position
          positions[j].x += (Math.random() - 0.5) * 4
          positions[j].y += (Math.random() - 0.5) * 4
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
      
      // Calcul de la distance avec la souris
      const dx = basePosition.originalX - (mousePosition.x * 15)
      const dy = basePosition.originalY - (mousePosition.y * 15)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Rayon d'influence de la souris
      const radius = 8
      
      if (distance < radius) {
        const force = (1 - distance / radius) * 1.5  // Force réduite à 1.5
        const angle = Math.atan2(dy, dx)
        
        model.position.x = basePosition.originalX + Math.cos(angle) * force
        model.position.y = basePosition.originalY + Math.sin(angle) * force
      } else {
        model.position.x += (basePosition.originalX - model.position.x) * 0.1
        model.position.y += (basePosition.originalY - model.position.y) * 0.1
      }
      
      // Rotation continue identique pour chaque modèle
      model.rotation.x += basePosition.rotationSpeed
      model.rotation.y += basePosition.rotationSpeed
      model.rotation.z += basePosition.rotationSpeed
    })
  })

  // Animation d'apparition/disparition des modèles d'arrière-plan
  useEffect(() => {
    // Tuer toutes les animations GSAP en cours sur les modèles
    modelsRef.current.forEach(model => {
      if (model) {
        gsap.killTweensOf(model.scale)
      }
    })
    
    if (isZoomed) {
      // Animation d'entrée des modèles d'arrière-plan
      modelsRef.current.forEach((model, index) => {
        if (!model) return
        
        gsap.fromTo(model.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            duration: 0.8,
            delay: index * 0.05,
            ease: "elastic.out(1, 0.5)"
          }
        )
      })

      // Animation d'entrée de la carte
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
      // Forcer la mise à l'échelle 0 immédiatement pour toutes les cannettes
      modelsRef.current.forEach(model => {
        if (model) {
          model.scale.set(0, 0, 0)
        }
      })

      // Animation de sortie de la carte
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.4,
        ease: "power2.in"
      })
    }

    // Nettoyage des animations au démontage
    return () => {
      modelsRef.current.forEach(model => {
        if (model) {
          gsap.killTweensOf(model.scale)
        }
      })
    }
  }, [isZoomed])

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

  return (
    <group>
      {/* Modèles d'arrière-plan avec rotations initiales */}
      {modelPositions.map((pos, index) => (
        <group 
          key={index} 
          ref={el => modelsRef.current[index] = el}
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotationX, pos.rotationY, pos.rotationZ]}
          scale={0}
        >
          <Float speed={1.5} rotationIntensity={0.5}>
            <ProjectModel1 />
          </Float>
        </group>
      ))}

      {/* Contenu principal */}
      <group ref={modelRef}>
   
        <Html
          position={[-7, 0, -8]}
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
            <h2>Redbull Challenge</h2>
            
            <div className="video-container">
              <video
                ref={videoRef}
                src="./redbull.mp4"
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
              <p>Projet réalisé en une semaine dans le cadre d'un challenge.
                <br />
                Le but était de présenter 3 nouveaux gouts de Redbull en équipe avec un designer
              </p>
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
                  window.open('https://github.com/Yaaaaannis/3dredbull', '_blank')
                }}
              >
                <FaGithub /> Code
              </button>
              <button 
                className="interactive-element"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open('https://3dredbull.vercel.app/', '_blank')
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

export default Project1 