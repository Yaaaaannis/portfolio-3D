import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Timeline = ({ projects, activeIndex, setActiveIndex }) => {
  const timelineRef = useRef()

  useEffect(() => {
    // Animation d'entrée de la timeline
    gsap.from(timelineRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }, [])

  return (
    <div className="timeline" ref={timelineRef}>
      <div className="timeline-container">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`timeline-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-label">{project.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline 