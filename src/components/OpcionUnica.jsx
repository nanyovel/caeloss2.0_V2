import { styled } from "styled-components";

import imgArrow2 from "./../importaciones/img/arrowRight2.png";
import { Tema } from "../config/theme";

export const OpcionUnica = ({
  titulo,
  name,
  arrayOpciones,
  handleOpciones,
  tipo,
  selectScreen,
  dosMobil,
  width,
  flete,
  marginRight,
  sinMarginTopBottom,
  dataGrupo,
  unPixerMargin,
  bottomOf,
}) => {
  return (
    <ContenedorParametro
      className={`
        ${dosMobil ? " dosMobil " : ""}
        ${width < 550 && flete ? " flete " : ""}
        ${width > 550 && flete ? " masPeque " : ""}
        ${marginRight ? " marginRight " : ""}
        ${bottomOf ? " bottomOf " : ""}
      `}
    >
      {titulo ? (
        <div>
          <TituloParametro
            className={
              tipo == "ciclo" && arrayOpciones[0].select == true
                ? "final"
                : tipo == "ciclo" && arrayOpciones[1].select == true
                  ? "final"
                  : ""
            }
          >
            {titulo}
          </TituloParametro>
        </div>
      ) : (
        ""
      )}
      <CajaParametro
        className={`
          ${tipo == "ciclo" ? " step " : ""}
          ${width < 550 && flete ? " flete " : ""}
         
        
        `}
      >
        {tipo != "ciclo" &&
          arrayOpciones?.map((opcion, index) => {
            return (
              <CajaBlanco key={`${index}`}>
                <Radio
                  className="inputRed"
                  type="radio"
                  name={name}
                  data-id={index}
                  data-code={opcion.code}
                  data-tipo={opcion.tipo}
                  value={index}
                  onChange={(e) => handleOpciones(e)}
                  checked={opcion.select}
                  // Esto lo hice con una combinancion del nombre mas el name, para evitar problemas, acabo de perder cerca de media hora resolviendo un problema y era que tenia dos grupo de seleccion unica, ambos con una opcion llamada chofer por lo cual el id era el mismo y no funcionaba correctamtenet
                  // 18/12/24 solucionado a las 11:55AM
                  id={opcion.nombre + name}
                  //
                  data-grupo={dataGrupo}
                />
                <Label
                  className={`
                    ${sinMarginTopBottom ? "sinMarginTopBottom" : ""}
                    ${unPixerMargin ? "unPixerMargin" : ""}
                    
                    `}
                  htmlFor={opcion.nombre + name}
                >
                  {opcion.nombre}
                </Label>
              </CajaBlanco>
            );
          })}

        {tipo == "ciclo" &&
          arrayOpciones?.map((step, index) => {
            return (
              <CajitaStep key={index}>
                <CajaStep
                  className={step.select == true ? "visible" : ""}
                  data-id={index}
                  onClick={(e) => selectScreen(e)}
                >
                  <Imagen
                    src={step.img}
                    data-id={index}
                    title={step.title}
                    className={step.select == true ? "selected" : ""}
                  />
                  <TextoStep
                    className={step.select == true ? "visible" : ""}
                    data-id={index}
                  >
                    {step.nombre}
                  </TextoStep>
                </CajaStep>
                <ImagenFlecha src={imgArrow2} />
              </CajitaStep>
            );
          })}
      </CajaParametro>
    </ContenedorParametro>
  );
};

const TituloParametro = styled.h2`
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
  color: #fff;
  margin-bottom: 8px;
  /* margin-left: 20px; */
  border-bottom: 1px solid #fff;
  white-space: nowrap;
  &.final {
    margin-left: 100%;
    transform: translate(-100%);
  }
  transform: ease 0.2s;
`;

const Radio = styled.input`
  display: none;
`;

const Label = styled.label`
  color: ${Tema.neutral.blancoHueso};
  white-space: nowrap;
  background-color: #163f5073;
  padding: 5px 10px 5px 30px;
  display: inline-block;
  position: relative;
  font-size: 0.9em;
  border-radius: 3px;
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
  margin: 5px 0px;
  &.unPixerMargin {
    margin: 1px 0px;
  }
  &.sinMarginTopBottom {
    margin-top: 0;
    margin-bottom: 0;
  }
  margin-right: 2px;
  font-weight: 2000;
  @media screen and (max-width: 394px) {
    padding: 5px 10px 5px 25px;

    /* top: 4px; */
  }
  @media screen and (max-width: 360px) {
    padding: 5px 10px 5px 20px;

    /* top: 4px; */
  }
  @media screen and (max-width: 340px) {
    padding: 5px 5px 5px 20px;

    /* top: 4px; */
  }

  &:hover {
    background-color: #0074d933;
  }
  &::before {
    content: "";
    width: 17px;
    height: 17px;
    display: inline-block;
    background-color: none;
    border: 3px solid ${Tema.primary.azulBrillante};
    border-radius: 50%;
    position: absolute;
    left: 5px;
    top: 5px;

    @media screen and (max-width: 380px) {
      /* top: 4px; */
    }
    @media screen and (max-width: 360px) {
      width: 14px;
      height: 14px;

      /* left: 14px; */
      top: 7px;
    }
    @media screen and (max-width: 340px) {
      /* width: 10px; */
      /* height: 10px; */
      /* left: 10px; */
    }
    @media screen and (max-width: 320px) {
      width: 8px;
      height: 8px;
      left: 8px;
    }
  }
  ${Radio}:checked + && {
    background-color: ${Tema.complementary.azulStatic};
    padding: 5px 5px;
    border-radius: 2px;
    color: #fff;
    /* @media screen and (max-width: 360px){

    padding: 4px  4px;
  } */
    @media screen and (max-width: 340px) {
      /* padding: 3px  3px; */
    }
    @media screen and (max-width: 320px) {
      padding: 2px 2px;
    }
  }
  ${Radio}:checked + &&::before {
    display: none;
  }
  @media screen and (max-width: 500px) {
    white-space: nowrap;
    /* width: 300px; */
    /* min-width: 100px; */
    /* word-wrap:; */
  }

  @media screen and (max-width: 385px) {
    /* font-size: 12px; */
    /* font-weight: normal; */
  }

  /* @media screen and (max-width: 340px){
    padding: 3px 7px 3px 30px;
  } */
  @media screen and (max-width: 320px) {
    padding: 2px 5px 2px 20px;
  }
  /* background-color: #fa9797; */
  color: #fff;
`;
const CajaBlanco = styled.div``;

const ContenedorParametro = styled.div`
  /* max-width: 1000px; */
  border: 1px solid transparent;
  border-bottom: 1px solid #fff;
  justify-content: start;
  align-items: start;
  flex-direction: column;
  display: flex;
  /* width: 45%; */
  &.marginRight {
    /* width: auto; */
    margin-right: 45px;
  }
  &.bottomOf {
    border-bottom: none;
  }
  &.error {
    border: 1px solid ${Tema.complementary.danger};
    border-radius: 5px;
  }
  &.dosMobil {
    margin: 0;
  }
  &.flete {
    width: 90%;
  }
  &.masPeque {
    width: 30%;
  }
  @media screen and (max-width: 319px) {
    flex-direction: column;
    /* width: 70%; */
  }
  @media screen and (max-width: 620px) {
    width: 90%;
  }
  @media screen and (max-width: 520px) {
    width: 100%;
  }
`;

const CajaParametro = styled.div`
  display: flex;
  &.step {
    justify-content: space-between;
    row-gap: 40px;
  }
  &.flete {
    flex-wrap: wrap;
    width: 100%;
  }
  justify-content: start;
  @media screen and (max-width: 319px) {
    flex-direction: column;
    /* row-gap: 40px; */
    flex-wrap: wrap;
    /* width: 100%; */
  }

  &.step {
    @media screen and (max-width: 500px) {
      row-gap: 40px;
      flex-wrap: wrap;
      width: 100%;
    }
    @media screen and (max-width: 400px) {
      row-gap: 20px;
    }
  }
`;

const CajitaStep = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  transition: ease 0.2s;
  @media screen and (max-width: 500px) {
    width: 60px;
  }
  @media screen and (max-width: 400px) {
    width: 33%;
  }
`;
const CajaStep = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  background-color: transparent;
  /* border: 1px solid #bbbbbb; */
  border-radius: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 60px;
  height: 45px;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 400px) {
    width: 40%;
    height: 40px;
  }
  &.visible {
    /* border: 1px solid white; */
  }
`;
const Imagen = styled.img`
  width: 70%;
  transition: ease 0.2s;

  &:hover {
    width: 60px;
  }
  &.selected {
    width: 60px;
    @media screen and (max-width: 400px) {
      width: 65px;
    }
  }
`;
const ImagenFlecha = styled.img`
  width: 15px;
  height: 20px;
`;
const TextoStep = styled.h2`
  font-size: 0.6rem;
  /* color: transparent; */
  white-space: nowrap;
  color: ${Tema.primary.azulBrillante};
  color: white;
  font-weight: 400;
  transition: ease 0.2s;
  margin-top: 4px;
  &.visible {
    font-weight: bold;
    font-size: 1rem;
    @media screen and (max-width: 380px) {
      text-align: start;
      margin-left: 30px;
    }
  }
`;
