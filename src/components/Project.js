import { Html } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Project = ({ project, isActive, index, angle, radius }) => {
  const groupRef = useRef()
  const contentRef = useRef()

  useEffect(() => {
    if (isActive) {
      // Animation d'ouverture
      gsap.to(groupRef.current.position, {
        z: Math.cos(angle) * (radius + 1),
        duration: 1,
        ease: "power3.out"
      })
      gsap.to(contentRef.current, {
        opacity: 1,
        duration: 0.5,
        delay: 0.5
      })
    } else {
      // Animation de fermeture
      gsap.to(groupRef.current.position, {
        z: Math.cos(angle) * radius,
        duration: 1,
        ease: "power3.out"
      })
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.3
      })
    }
  }, [isActive, angle, radius])

  return (
    <group 
      ref={groupRef} 
      position={[
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
      ]}
    >
      <Html
        ref={contentRef}
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          width: '300px',
          pointerEvents: isActive ? 'auto' : 'none'
        }}
        position={[0, 0, 0.1]}
        center
      >
        <div className="project-content">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <button 
            onClick={() => window.open(project.link, '_blank')}
            style={{
              background: '#ff3366',
              border: 'none',
              padding: '10px 20px',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Voir le projet
          </button>
        </div>
      </Html>
    </group>
  )
}

export default Project 