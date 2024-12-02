import styled from 'styled-components'

const ContactContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  color: #1a1a1a;
  text-align: right;
  font-family: 'Space Grotesk', sans-serif;
  z-index: 1000;
`

const ContactTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  color: #000000;

  &:hover {
    opacity: 1;
  }
`

const ContactLink = styled.a`
  display: block;
  color: #333333;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    color: #000000;
    opacity: 1;
    transform: translateX(-5px);
  }
`

const TwitterIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
  vertical-align: middle;
  margin-left: 5px;
`

const Contact = () => {
  return (
    <ContactContainer>
      <ContactTitle>CONTACT</ContactTitle>
      <ContactLink 
        href="https://x.com/RoadToDevWebb" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <TwitterIcon viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </TwitterIcon>
      </ContactLink>
      <ContactLink 
        href="mailto:yannisfebvre@gmail.com"
      >
        yannisfebvre@gmail.com
      </ContactLink>
    </ContactContainer>
  )
}

export default Contact