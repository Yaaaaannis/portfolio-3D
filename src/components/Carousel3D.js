import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Line, Html, Environment, color } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import ProjectModel2 from './models/ProjectModel2'
import Project2 from './projects/Project2'
import ProjectModel3 from './models/ProjectModel3'
// Composants
import Project1 from './projects/Project1'
import ProjectModel1 from './models/ProjectModel1'
import Project3 from './projects/Project3'
// Composant pour le modèle 3D de chaque projet
const ProjectModel = ({ project, isActive }) => {
  switch(project.id) {
    case 1:
      return <ProjectModel1 isActive={isActive} />
    case 2:
      return <ProjectModel2 isActive={isActive} />
    case 3:
      return <ProjectModel3 isActive={isActive} />
    default:
      return null
  }
}

const Carousel3D = ({ projects, setActiveIndex }) => {
  const { raycaster, scene } = useThree()
  const groupRef = useRef()
  const timelineRef = useRef()
  const rotationRef = useRef(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [anyProjectZoomed, setAnyProjectZoomed] = useState(false)
  const [activeIndex, setLocalActiveIndex] = useState(0)

  // Position de la timeline
  const timelineY = -1.5
  const timelineZ = 2
  const sphereRadius = 0.1

  // Initialisation et configuration de la scène
  useEffect(() => {
    // Définir la couleur de fond
    scene.background = new THREE.Color('#F7F7F7')
    
    // Configuration initiale pour le premier projet
    if (groupRef.current) {
      const angle = 0
      rotationRef.current = -angle
      groupRef.current.rotation.y = -angle
    }

    // Forcer la sélection du premier projet au démarrage
    setActiveIndex(0)
  }, [scene, setActiveIndex])

  useEffect(() => {
    const zoomedProject = projects.find((_, index) => 
      activeIndex === index && isZoomed
    )
    setAnyProjectZoomed(!!zoomedProject)
  }, [isZoomed, activeIndex, projects])

  const handleProjectClick = (index, e) => {
    e.stopPropagation()
    
    // Si on clique sur le projet actif (zoom/dézoom)
    if (activeIndex === index) {
      const angle = (index / projects.length) * Math.PI * 2
      const targetZ = isZoomed ? Math.cos(angle) * 3 : 0.5
      const targetX = isZoomed ? Math.sin(angle) * 3 : 0
      const targetScale = isZoomed ? 1 : 2.5

      gsap.to(groupRef.current.children[index].position, {
        x: targetX,
        z: targetZ,
        duration: 1,
        ease: "power2.inOut"
      })

      gsap.to(groupRef.current.children[index].scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 1,
        ease: "power2.inOut"
      })

      setIsZoomed(!isZoomed)
      setActiveIndex(index)
    } 
    // Si on clique sur un nouveau projet alors qu'un projet est zoomé
    else if (isZoomed) {
      // D'abord, dézoomer le projet actif
      const currentAngle = (activeIndex / projects.length) * Math.PI * 2
      gsap.to(groupRef.current.children[activeIndex].position, {
        x: Math.sin(currentAngle) * 3,
        z: Math.cos(currentAngle) * 3,
        duration: 1,
        ease: "power2.inOut"
      })

      gsap.to(groupRef.current.children[activeIndex].scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.inOut"
      })

      // Ensuite, passer au nouveau projet
      setIsZoomed(false)
      setLocalActiveIndex(index)
      setActiveIndex(index)
      const newAngle = (index / projects.length) * Math.PI * 2
      rotationRef.current = -newAngle
      gsap.to(groupRef.current.rotation, {
        y: -newAngle,
        duration: 1,
        ease: "power2.out"
      })
    }
    // Si on clique sur un nouveau projet (cas normal)
    else {
      setLocalActiveIndex(index)
      setActiveIndex(index)
      const angle = (index / projects.length) * Math.PI * 2
      rotationRef.current = -angle
      gsap.to(groupRef.current.rotation, {
        y: -angle,
        duration: 1,
        ease: "power2.out"
      })
    }
  }

  const handleTimelineClick = (index) => {
    // Si on clique sur le projet actif
    if (activeIndex === index) {
      const angle = (index / projects.length) * Math.PI * 2
      const targetZ = isZoomed ? Math.cos(angle) * 3 : 0.5
      const targetX = isZoomed ? Math.sin(angle) * 3 : 0
      const targetScale = isZoomed ? 1 : 2.5

      gsap.to(groupRef.current.children[index].position, {
        x: targetX,
        z: targetZ,
        duration: 1,
        ease: "power2.inOut"
      })

      gsap.to(groupRef.current.children[index].scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 1,
        ease: "power2.inOut"
      })

      setIsZoomed(!isZoomed)
    } 
    // Si on clique sur un nouveau projet
    else {
      // Si un projet est déjà zoomé, on le dézoome d'abord
      if (isZoomed) {
        const currentAngle = (activeIndex / projects.length) * Math.PI * 2
        gsap.to(groupRef.current.children[activeIndex].position, {
          x: Math.sin(currentAngle) * 3,
          z: Math.cos(currentAngle) * 3,
          duration: 1,
          ease: "power2.inOut"
        })

        gsap.to(groupRef.current.children[activeIndex].scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          ease: "power2.inOut"
        })
        setIsZoomed(false)
      }

      setLocalActiveIndex(index)
      const angle = (index / projects.length) * Math.PI * 2
      rotationRef.current = -angle
      gsap.to(groupRef.current.rotation, {
        y: -angle,
        duration: 1,
        ease: "power2.out"
      })
    }
  }

  useFrame(() => {
    if (groupRef.current && !isZoomed) {
      groupRef.current.rotation.y += (rotationRef.current - groupRef.current.rotation.y) * 0.1
    }
  })

  // Calculer les positions des points de la timeline
  const timelinePoints = projects.map((_, index) => {
    const spacing = 0.5
    const totalWidth = (projects.length - 1) * spacing
    const x = (index * spacing) - (totalWidth / 2)
    return new THREE.Vector3(x, timelineY, timelineZ)
  })

  return (
    <>
      <group ref={groupRef}>
        {projects.map((project, index) => {
          const angle = (index / projects.length) * Math.PI * 2
          const radius = 3
          
          return (
            <group
              key={project.id}
              position={[
                Math.sin(angle) * radius,
                0,
                Math.cos(angle) * radius
              ]}
              onClick={(e) => {
                const intersects = raycaster.intersectObjects(groupRef.current.children, true)
                if (intersects.length > 0 && intersects[0].object === e.object) {
                  handleProjectClick(index, e)
                }
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'default'
              }}
            >
              <ProjectModel 
                project={project} 
                isActive={activeIndex === index}
              />
              
              {activeIndex === index && (
                <ProjectContent 
                  project={project} 
                  isZoomed={isZoomed}
                />
              )}
            </group>
          )
        })}
      </group>

      {/* Timeline modifiée */}
      <group ref={timelineRef} visible={!anyProjectZoomed && !isZoomed}>
        <Line
          points={timelinePoints}
          color="#ffffff"
          lineWidth={1}
          opacity={0.5}
        />
        
        {timelinePoints.map((point, index) => (
          <group key={index} position={point}>
            <mesh
              onClick={() => handleTimelineClick(index)}
              onPointerOver={(e) => {
                document.body.style.cursor = 'pointer'
                e.object.scale.multiplyScalar(1.2)
              }}
              onPointerOut={(e) => {
                document.body.style.cursor = 'default'
                e.object.scale.multiplyScalar(1/1.2)
              }}
            >
              <sphereGeometry args={[sphereRadius, 32, 32]} />
              <meshStandardMaterial 
                color={activeIndex === index ? '#ff3366' : '#ffffff'}
                emissive={activeIndex === index ? '#ff3366' : '#000000'}
                emissiveIntensity={activeIndex === index ? 0.5 : 0}
              />
            </mesh>
            
            <Html
              position={[0, -0.2, 0]}
              center
              style={{
                color: activeIndex === index ? '#ff3366' : '#ffffff',
                fontSize: '0.8rem',
                opacity: (!anyProjectZoomed && !isZoomed) ? (activeIndex === index ? 1 : 0.7) : 0,
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                visibility: (!anyProjectZoomed && !isZoomed) ? 'visible' : 'hidden'
              }}
            >
              {projects[index].title || `Projet ${index + 1}`}
            </Html>
          </group>
        ))}
      </group>

      {/* Éclairage amélioré */}
      <ambientLight intensity={0.8} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.6}
        color="#ffffff"
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.4}
        color="#ffffff"
      />
      <pointLight 
        position={[0, 5, 5]} 
        intensity={0.5}
        color="#ffffff"
      />
      
      <Environment 
        preset="studio" 
        intensity={0.5}
      />
    </>
  )
}

// Composant placeholder pour le contenu spécifique du projet
const ProjectContent = ({ project, isZoomed }) => {
  switch(project.id) {
    case 1:
      return <Project1 isZoomed={isZoomed} />
    case 2:
      return <Project2 isZoomed={isZoomed} />
    case 3:
      return <Project3 isZoomed={isZoomed} />
    default:
      return null
  }
}

export default Carousel3D 