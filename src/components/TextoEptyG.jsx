// Comentado el 4/9/25
import styled from "styled-components";

// ~
// ~
// ~
// ~
// ~
// ~
// ~
// ~
export default function TextoEptyG({ texto }) {
  return <Texto>{texto}</Texto>;
}
const Texto = styled.h2`
  margin-top: 50px;
  color: white;
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 400;
`;
