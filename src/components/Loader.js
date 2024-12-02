import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(0.95);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.isLoading ? 1 : 0};
  visibility: ${props => props.isLoading ? 'visible' : 'hidden'};
  transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
`

const LoaderWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  animation: ${pulse} 2s ease-in-out infinite;
`

const Circle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: ${props => props.color || '#000'};
  animation: ${rotate} ${props => props.duration || '1.5s'} linear infinite;
  opacity: ${props => props.opacity || 1};

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
  }

  &::before {
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-top-color: ${props => props.secondaryColor || '#333'};
    animation: ${rotate} ${props => props.innerDuration || '2s'} linear infinite;
  }

  &::after {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-top-color: ${props => props.tertiaryColor || '#666'};
    animation: ${rotate} ${props => props.innerDuration2 || '1s'} linear infinite;
  }
`

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #FFF;
  letter-spacing: 1px;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`

const Title = styled.h1`
  font-family: 'Syncopate', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 4px;
  margin-bottom: 3rem;
  text-transform: uppercase;
  opacity: 0.9;
    transition: color 0.3s ease, transform 0.3s ease;

&:hover {
    color: #e6e6e6; // Change la couleur au survol
    transform: scale(1.05); // Légère mise à l'échelle
  }
`

const Subtitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: #e6e6e6;
  letter-spacing: 3px;
  margin-top: 2rem;
  text-transform: uppercase;
  opacity: 0.7;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
    color: #ffffff; // Change la couleur au survol
    transform: scale(1.05); // Légère mise à l'échelle
  }
`

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Loader = ({ isLoading }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let interval;
    
    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev > 80 ? 0.5 : 1;
          return Math.min(prev + increment, 99);
        });
      }, 50);
    } else {
      setProgress(100);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <LoaderContainer isLoading={isLoading}>
      <LoaderContent>
        <Title>Yannis Febvre Studio</Title>
        <LoaderWrapper>
          <Circle 
            color="#ffffff"
            secondaryColor="#e6e6e6"
            tertiaryColor="#cccccc"
            duration="2s"
            innerDuration="1.5s"
            innerDuration2="1s"
          />
          <ProgressText>{Math.round(progress)}%</ProgressText>
        </LoaderWrapper>
        <Subtitle>Creative Developer</Subtitle>
      </LoaderContent>
    </LoaderContainer>
  )
}

export default Loader; 