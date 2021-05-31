import React from 'react'
import { Lottie } from '@crello/react-lottie'
import styled from 'styled-components'
import beeAnimation from '../../assets/lotties/bee-animation.json'

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.fill ? "100vh" : "180px")};
  width: 100%;
`

const LocalLoader = ({ fill }) => {
  return (
    <Wrapper fill={fill}>
      <Lottie
        config={{
          animationData: beeAnimation,
          loop: true,
        }}
        height={fill ? 100 : 84}
        width={fill ? 100 : 84}
      />
    </Wrapper>
  )
}

export default LocalLoader
