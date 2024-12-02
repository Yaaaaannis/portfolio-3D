import { useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import './Project1.css'
import { FaPlay, FaPause, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import SoundWaves from '../backgrounds/SoundWaves'

const Project3 = ({ isZoomed }) => {
  const modelRef = useRef()
  const cardRef = useRef()
  const videoRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isZoomed) {
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
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.4,
        ease: "power2.in"
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
      <SoundWaves isZoomed={isZoomed} />
      <group ref={modelRef}>
        <Html
          position={[8, 0, 7.5]}
          rotation={[0, -Math.PI / 1, 0]}
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
            <h2>Finistère en Scène</h2>
            
            <div className="video-container">
              <video
                ref={videoRef}
                src="./v1.mp4"
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
              <p>Application web permettant de consulter les programmations de différentes salles de spectacles
                <br />
                Possibilité de filtrer par date et lieu via carte interactive
              </p>
            </div>

            <div className="content-section">
              <h3>Technologies utilisées</h3>
              <p>Next.js, Prisma, Gsap</p>
            </div>

            <div className="buttons-container">
              <button 
                className="interactive-element"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open('https://github.com/Yaaaaannis', '_blank')
                }}
              >
                <FaGithub /> Code
              </button>
              <button 
                className="interactive-element"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open('https://www.finistereenscene.com/', '_blank')
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

export default Project3 