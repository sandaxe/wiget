import React from 'react';
import styled from 'styled-components';
const Pill = styled.p`
display: flex;
justify-content: center;
align-items: center;
width: 20px;
height: 20px;
padding: 2px;
border-radius: 100%;
background-color: ${props => props.bg};
position: relative;
top: ${props => props.positionTop ? props.positionTop : "-21px" };
right: ${props => props.positionRight ? props.positionRight : "-108px"};
object-fit: contain;
color: white;
`;

// eslint-disable-next-line react/prop-types
export const BubbleComponent = ({ text, bg, positionRight, positionTop }) => {
  return (
    <Pill bg={bg} positionRight={positionRight} positionTop={positionTop}>
      {text}
    </Pill>);
}
;
