import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MeshReflectorMaterial } from '@react-three/drei'
import "./App.css"


// Components
import Carousel3D from './components/Carousel3D'
import Loader from './components/Loader'
import Contact from './components/Contact'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselVisible, setCarouselVisible] = useState(false)
  const [cursorState, setCursorState] = useState('default')

  useEffect(() => {
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(minLoadingTime)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCarouselVisible(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const projects = [
    { 
      id: 1, 
      title: 'Challenge Redbull',
      description: 'Projet réalisé en une semaine dans le cadre d\'un challenge. Le but était de présenter 3 nouveaux gouts de Redbull en équipe avec un designer.',
      link: 'https://3dredbull.vercel.app/'
    },
    { 
      id: 2, 
      title: 'Roaster BMS',
      description: 'Projet personnel pour mon portfolio. Un roaster 3D de BMS.',
      link: 'https://bms-eosin.vercel.app/'
    },
    { 
      id: 3, 
      title: 'Finistère en Scène',
      description: 'Projet de création d\'une lyre asservie en 3D',
      link: 'https://3dlight.vercel.app/'
    },
    { 
      id: 4, 
      title: 'Project 4',
      description: 'Description détaillée du projet 4...',
      link: 'https://projet4.com'
    }
  ]

  useEffect(() => {
    // Créer un ScrollTrigger pour chaque section
    projects.forEach((_, index) => {
      ScrollTrigger.create({
        trigger: `.virtual-section-${index}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
        // markers: true, // Utile pour le debug
        scrub: 1, // Rend l'animation plus fluide
      })
    })

    // Configurer le smooth scroll avec GSAP
    gsap.to('.virtual-scroll', {
      ease: 'none',
      scrollTrigger: {
        trigger: '.virtual-scroll',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    })

    return () => {
      // Nettoyer tous les ScrollTriggers lors du démontage
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [projects.length])

  // Curseur personnalisé
  useEffect(() => {
    const cursor = document.createElement('div')
    const follower = document.createElement('div')
    
    cursor.className = 'cursor'
    follower.className = 'cursor-follower'
    
    document.body.appendChild(cursor)
    document.body.appendChild(follower)
    
    let mouseX = 0
    let mouseY = 0
    let posX = 0
    let posY = 0
    
    gsap.to({}, {
      duration: 0.016,
      repeat: -1,
      onRepeat: () => {
        posX += (mouseX - posX) / 9
        posY += (mouseY - posY) / 9

        // Appliquer différents styles selon l'état du curseur
        switch(cursorState) {
          case 'project-hover':
            cursor.classList.add('project-hover')
            follower.classList.add('project-hover')
            break
          default:
            cursor.classList.remove('project-hover')
            follower.classList.remove('project-hover')
        }
        
        gsap.set(follower, {
          css: {
            left: posX - 12,
            top: posY - 12
          }
        })
        
        gsap.set(cursor, {
          css: {
            left: mouseX,
            top: mouseY
          }
        })
      }
    })
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })
    
    return () => {
      document.body.removeChild(cursor)
      document.body.removeChild(follower)
    }
  }, [cursorState])

  return (
    <div className="App">
      <Loader isLoading={isLoading} />
      
      <Suspense fallback={null}>
        <div className={`carousel-container ${carouselVisible ? 'visible' : ''}`}>
          <Canvas
            camera={{
              position: [0, 0, 5],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={['#000000']} />
            <Carousel3D 
              activeIndex={activeIndex} 
              setActiveIndex={setActiveIndex}
              projects={projects}
            />
            

            
          </Canvas>
        </div>
      </Suspense>
      <Contact />
    </div>
  )
}

export default App
