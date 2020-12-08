import React from 'react';
import styled from 'styled-components';
const Pill = styled.div`
width: 67px;
height: 19px;
padding: 5px;
border-radius: 6px;
box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14);
border: solid 1px #ffffff;
background-image: linear-gradient(145deg, #00d2ff, #3a7bd5);
display: flex;
align-items:center;
align-content:center;
justify-items: center;
justify-content: center;
font-size: 11px;
position: relative;
top: 10px;
left: 80px;
cursor: default;

p {
  flex-grow: 1;
  color: white;
  margin-right: 1px;
  width: 100%;
}
span {
   cursor: pointer !important;
   margin-right: 1px;
   font-size: 14px;
   color: white;
}
@media screen and (min-width: 1794px) and (max-width: 1893px) {
  left: 108px;
}
@media screen and (min-width: 1894px) and (max-width: 1919px) {
  left: 110px;
}
@media screen and (min-width: 1920px) {
  left: 111px;
}
@media (max-width: 1400px) and (min-width: 1250px){
  left: 69px;
}
`;

// eslint-disable-next-line react/prop-types
export const PillComponent = ({ text, clearFunction }) => {
  return (
    <Pill>
      <p>{text}</p>
      <span onClick={clearFunction}>&times;</span>
    </Pill>);
}
;
