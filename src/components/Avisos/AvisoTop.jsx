import styled from "styled-components";
import { Tema } from "../../config/theme";
import { getAuth } from "firebase/auth";
import { BtnGeneralButton } from "../BtnGeneralButton";

export const AvisoTop = ({ ctaTexto, cta, mensaje }) => {
  const auth = getAuth();

  return (
    <Contenedor>
      <Texto>{mensaje}</Texto>
      {ctaTexto ? (
        <BtnSimple onClick={() => cta()}>{ctaTexto}</BtnSimple>
      ) : null}
    </Contenedor>
  );
};

const Contenedor = styled.div`
  border: 1px solid ${Tema.complementary.warning};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: ${Tema.secondary.azulOlivo};
`;
const Texto = styled.h3`
  color: ${Tema.complementary.warning};
  font-weight: lighter;
`;

const BtnSimple = styled(BtnGeneralButton)`
  width: auto;
`;
