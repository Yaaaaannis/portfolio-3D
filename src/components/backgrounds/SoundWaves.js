import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const MusicNote = () => (
  <mesh>
    <torusGeometry args={[0.3, 0.1, 16, 32]} />
    <meshPhysicalMaterial
      color="#4fc3f7"
      metalness={0.8}
      roughness={0.2}
      transparent
      opacity={0.8}
    />
  </mesh>
)

const SoundWaves = ({ isZoomed }) => {
  const notesRef = useRef([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const animationsRef = useRef([]) // Pour stocker les animations GSAP

  // Modification des positions initiales des notes
  const notePositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 70; i++) {
      positions.push({
        // Distribution sur tout l'écran
        x: -25 + Math.random() * 50, // -25 à 25 pour couvrir toute la largeur
        y: -15 + Math.random() * 30, // -15 à 15 pour la hauteur
        z: 7.5,
        get originalX() { return this.x },
        get originalY() { return this.y },
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeed: 0.01 + Math.random() * 0.02,
        scale: 0.5 + Math.random() * 0.5,
        color: [
          '#4fc3f7', // Bleu clair
          '#2196f3', // Bleu
          '#1976d2', // Bleu foncé
          '#ff4081', // Rose
          '#f50057'  // Rose foncé
        ][Math.floor(Math.random() * 5)]
      })
    }

    // Vérification des distances minimales avec une distance plus grande
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x
        const dy = positions[i].y - positions[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 3) { // Distance minimale augmentée
          positions[j].x += (Math.random() - 0.5) * 4
          positions[j].y += (Math.random() - 0.5) * 4
        }
      }
    }

    return positions
  }, [])

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

  useEffect(() => {
    // Nettoyer toutes les animations précédentes
    animationsRef.current.forEach(anim => anim.kill())
    animationsRef.current = []

    if (isZoomed) {
      notesRef.current.forEach((note, index) => {
        if (!note) return
        const animation = gsap.fromTo(note.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: notePositions[index].scale,
            y: notePositions[index].scale,
            z: notePositions[index].scale,
            duration: 0.8,
            delay: index * 0.03,
            ease: "elastic.out(1, 0.5)"
          }
        )
        animationsRef.current.push(animation)
      })
    } else {
      notesRef.current.forEach((note, index) => {
        if (!note) return
        const animation = gsap.to(note.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.3,
          ease: "power2.in"
        })
        animationsRef.current.push(animation)
      })
    }

    // Cleanup function
    return () => {
      animationsRef.current.forEach(anim => anim.kill())
      animationsRef.current = []
    }
  }, [isZoomed])

  useFrame(() => {
    notesRef.current.forEach((note, index) => {
      if (!note) return
      
      const basePosition = notePositions[index]
      
      // Calcul de la distance avec la souris
      const dx = basePosition.originalX - (mousePosition.x * 15)
      const dy = basePosition.originalY - (mousePosition.y * 15)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Rayon d'influence de la souris
      const radius = 8
      
      if (distance < radius) {
        // Force plus importante pour un effet de "balayage"
        const force = (1 - distance / radius) * 3
        const angle = Math.atan2(dy, dx)
        
        // Déplacement plus dynamique
        note.position.x = basePosition.originalX + Math.cos(angle) * force
        note.position.y = basePosition.originalY + Math.sin(angle) * force
        
        // Rotation plus rapide quand affecté par la souris
        note.rotation.x += basePosition.rotationSpeed * 3
        note.rotation.y += basePosition.rotationSpeed * 3
        note.rotation.z += basePosition.rotationSpeed * 3
        
        // Légère variation de la position Z pour un effet de profondeur
        note.position.z = basePosition.z + Math.sin(distance) * 0.5
      } else {
        // Retour plus lent à la position d'origine
        note.position.x += (basePosition.originalX - note.position.x) * 0.05
        note.position.y += (basePosition.originalY - note.position.y) * 0.05
        note.position.z += (basePosition.z - note.position.z) * 0.05
        
        // Rotation normale
        note.rotation.x += basePosition.rotationSpeed
        note.rotation.y += basePosition.rotationSpeed
        note.rotation.z += basePosition.rotationSpeed
      }
    })
  })

  return (
    <group position={[0, 0, 0]}>
      {notePositions.map((pos, index) => (
        <group
          key={index}
          ref={el => notesRef.current[index] = el}
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotationX, pos.rotationY, pos.rotationZ]}
          scale={0}
        >
          <Float speed={1.5} rotationIntensity={0.5}>
            <mesh scale={pos.scale}>
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
              <meshPhysicalMaterial
                color={pos.color}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.8}
                emissive={pos.color}
                emissiveIntensity={0.2}
              />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  )
}

export default SoundWaves