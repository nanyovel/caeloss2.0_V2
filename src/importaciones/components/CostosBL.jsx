import React from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { Tema } from "../../config/theme";

export const CostosBL = ({
  costoArray,
  setCostoArray,
  setMostrarCostos,
  blEditables,
  setBLEditables,
  blEditable,
  setBLEditable,
  modo,
}) => {
  const handleCosto = (index, e) => {
    const { name, value } = e.target;

    const newCostos = [...costoArray.costos];
    const regex = /^[0-9]*$/;

    if (name == "monto") {
      if (regex.test(value)) {
        newCostos[index] = {
          ...newCostos[index],
          [name]: Number(value),
        };
      }
    } else {
      newCostos[index] = {
        ...newCostos[index],
        [name]: value,
      };
    }

    setCostoArray({
      ...costoArray,
      costos: newCostos,
    });
  };
  const guardarCambios = () => {
    if (modo == "detalleBL") {
      setBLEditable({
        ...blEditable,
        costos: costoArray.costos,
      });
    } else {
      const newEditable = blEditables.map((bl) => {
        if (bl.id == costoArray.idBL && bl.numeroDoc == costoArray.blIndicado) {
          return {
            ...bl,
            costos: costoArray.costos,
          };
        } else {
          return bl;
        }
      });
      setBLEditables(newEditable);
    }
    setMostrarCostos(false);
  };

  return (
    <CajaCosteo>
      <HeadCosto>
        <TituloCosto>Costos</TituloCosto>
        <CajaXCerrar onClick={(e) => setMostrarCostos(false)}>❌</CajaXCerrar>
      </HeadCosto>
      <Tabla>
        <thead>
          <Filas className="cabeza">
            <CeldaHead>Tipo</CeldaHead>
            <CeldaHead>Monto</CeldaHead>
            <CeldaHead>Obs</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {costoArray.costos.map((costo, index) => {
            return (
              <Filas className="body" key={index}>
                <CeldasBody className="tipo">
                  <InputEditable
                    name="tipo"
                    type="text"
                    value={costo.tipo}
                    onChange={(e) => handleCosto(index, e)}
                    autoComplete="off"
                  />
                </CeldasBody>
                <CeldasBody className="monto">
                  <InputEditable
                    name="monto"
                    type="text"
                    className="monto"
                    value={costo.monto}
                    onChange={(e) => handleCosto(index, e)}
                    autoComplete="off"
                  />
                </CeldasBody>
                <CeldasBody className="">
                  <InputEditable
                    name="obs"
                    type="text"
                    className="monto"
                    value={costo.obs}
                    onChange={(e) => handleCosto(index, e)}
                    autoComplete="off"
                  />
                </CeldasBody>
              </Filas>
            );
          })}
        </tbody>
      </Tabla>
      <CajaBtnGuardar>
        <BtnGuardar onClick={() => guardarCambios()}>Guardar</BtnGuardar>
      </CajaBtnGuardar>
    </CajaCosteo>
  );
};
const CajaCosteo = styled.div`
  /* position: fixed; */
  width: 800px;
  max-width: 80%;
  margin: auto;
  margin-bottom: 100px;
  /* height: 2000px; */
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 5px;
  background-color: #000;
`;
const HeadCosto = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const TituloCosto = styled.h2`
  color: white;
  width: 100%;
  text-align: center;
  padding-left: 40px;
`;
const CajaXCerrar = styled.div`
  width: 40px;
  /* border: 1px solid red; */
  cursor: pointer;
  text-align: center;
  border: 1px solid ${Tema.complementary.warning};
  /* border-radius: 5px 0 5px 0; */
  &:hover {
    border-radius: 5px;
    transition: ease 0.3s;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${Tema.secondary.azulSuave};
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  color: ${Tema.secondary.azulOpaco};
  &:hover {
    /* background-color: ${Tema.secondary.azulProfundo}; */
  }
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 35px;
  /* padding-left: 5px; */
  /* padding-right: 5px; */
  &.monto {
    width: 80px;
  }
  &.tipo {
    /* width: 80px; */
    min-width: 80px;
  }

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
`;

const InputCelda = styled.input`
  /* border: none; */
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.secondary.azulOpaco};
  color: #c5b7b7;

  border: none;
  width: 100%;

  display: flex;
  border: 1px solid transparent;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const InputEditable = styled(InputCelda)`
  height: 100%;
  width: 100%;
  margin: 0;
  /* border-radius: 5px; */
  font-size: 0.9rem;

  /* border-radius: 0; */
  /* color: inherit; */
`;
const CajaBtnGuardar = styled.div`
  width: 100%;
  /* height: 40px; */
  /* padding: 5px; */
  /* border: 1px solid red; */
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
`;
const BtnGuardar = styled(BtnGeneralButton)``;
