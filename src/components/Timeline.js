import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styled from 'styled-components'

const GlassTimeline = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 2rem;
  z-index: 1000;
`

const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  transition: all 0.3s ease;
  
  ${({ active }) => active && `
    background: #ff3366;
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.5);
  `}
`

const Label = styled.div`
  font-size: 0.8rem;
  color: ${props => props.active ? '#ff3366' : '#fff'};
  opacity: 0.8;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 1px;
`

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
    <GlassTimeline ref={timelineRef}>
      {projects.map((project, index) => (
        <TimelineItem
          key={project.id}
          onClick={() => setActiveIndex(index)}
        >
          <Dot active={activeIndex === index} />
          <Label active={activeIndex === index}>
            {project.title}
          </Label>
        </TimelineItem>
      ))}
    </GlassTimeline>
  )
}

export default Timeline 