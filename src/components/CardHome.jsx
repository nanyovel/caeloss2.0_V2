import { Link } from "react-router-dom";
import { styled } from "styled-components";
import ImgCerrado from "../../public/img/candadoCerrado.png";
import { CalcDay } from "../libs/CalcDay.js";
import { Tema, Theme } from "../config/theme.jsx";

export const CardHome = ({
  ImagenCard,
  titulo,
  ruta,
  title,
  incompleto,
  fijo,
  bloqueado,
  fechaInicial,
  fechaFinal,
}) => {
  return (
    <>
      {!bloqueado ? (
        <Card title={title}>
          <EnlacePrincipal to={`${ruta}`}>
            <CajaImagen>
              <Imagen src={ImagenCard} />
              <CajaPorcentaje
                className={`${incompleto ? "incompleto" : ""}`}
              ></CajaPorcentaje>
            </CajaImagen>
            {!incompleto ? (
              !fijo ? (
                <TextoCard>{titulo}</TextoCard>
              ) : fijo ? (
                <TextoFijo>{titulo}</TextoFijo>
              ) : (
                ""
              )
            ) : (
              <TextoIncompleto>
                {titulo + " "} {CalcDay(fechaInicial, fechaFinal) + "%"}
              </TextoIncompleto>
            )}
          </EnlacePrincipal>
        </Card>
      ) : (
        <Card>
          <EnlacePrincipal to={`${ruta}`}>
            <CajaImagen className={incompleto ? "incompleto" : ""}>
              {bloqueado ? (
                <Imagen className="bloqueado" src={ImgCerrado} />
              ) : null}
            </CajaImagen>
          </EnlacePrincipal>
        </Card>
      )}
    </>
  );
};

const Card = styled.div`
  width: 20%;
  height: 150px;
  border: 1px solid #535353;
  border-color: ${Tema.primary.azulOscuro};
  overflow: hidden;
  border-radius: 20px 0 20px 0;
  position: relative;
  box-shadow: 4px 4px 4px -1px rgba(0, 0, 0, 0.43);
  margin: 0 5px;
  transition: width ease 0.5s;
  &:hover {
    border: 2px solid #fff;
    width: 50%;
  }
  @media screen and (max-width: 750px) {
    width: 100%;
  }
`;
const EnlacePrincipal = styled(Link)`
  text-decoration: none;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    opacity: 1;
    animation: arroz 1s;
    animation-direction: normal;
  }

  @keyframes arroz {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`;

const CajaImagen = styled.div`
  display: block;
  overflow: hidden;
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  background-size: contain;
  background-repeat: no-repeat;
  object-fit: cover;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const TextoCard = styled.h2`
  color: white;
  font-weight: 200;
  text-decoration: none;
  font-size: 1.3rem;
  text-align: center;

  @media screen and (max-width: 750px) {
    flex-direction: column;
    font-size: 1.9rem;
  }
`;
const TextoIncompleto = styled(TextoCard)`
  color: ${Tema.complementary.warning};
`;
const TextoFijo = styled(TextoCard)`
  color: ${Tema.complementary.warning};
`;
const Imagen = styled.img`
  width: 100%;
  height: 50%;
  object-fit: contain;
  position: absolute;
  z-index: 1;
`;

const CajaPorcentaje = styled.div`
  &.incompleto {
    position: absolute;
    width: 100%;
    background-color: #000;
    top: 0;
  }
  z-index: 5;
`;
