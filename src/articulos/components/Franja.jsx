import styled from "styled-components";

export const Franja = styled.div`
  height: 45px;
  background-color: #0a2040; /* azul bandana */
  background-image: radial-gradient(
      circle at 10px 10px,
      white 2px,
      transparent 3px
    ),
    radial-gradient(circle at 30px 30px, white 2px, transparent 3px),
    radial-gradient(circle at 50px 10px, white 2px, transparent 3px),
    radial-gradient(circle at 70px 30px, white 2px, transparent 3px),
    radial-gradient(circle at 90px 10px, white 2px, transparent 3px),
    radial-gradient(circle at 50px 50px, transparent 0, #0a2040 0);
  background-size: 100px 50px;
  background-repeat: repeat-x;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  &.invertido {
    transform: rotate(180deg);
  }
`;
