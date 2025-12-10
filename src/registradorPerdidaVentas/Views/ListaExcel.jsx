import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../config/theme";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
  TextArea,
} from "../../components/InputGeneral";
import TablaExcel from "../components/TablaExcel";

export default function ListaExcel({
  ventaPerdida,
  MotivoPerdida,
  setVentaPerdida,
  initialVentaPerdida,
  ListaArticulos,
  enviarObjeto,
  setValueTabla,
}) {
  const allColEnable = {
    codigo: true,
    descripcion: false,
    cantidad: true,
    precio: true,
    total: false,
  };
  const noInvetario = {
    codigo: false,
    descripcion: true,
    cantidad: true,
    precio: true,
    total: false,
  };
  const [columnasActivas, setColumnasActivas] = useState({
    ...allColEnable,
  });
  // ****************************** FUNCIONAMIENTO TABLA ******************************

  const [inputsArray, setInputsArray] = useState([]);
  useEffect(() => {
    const arrayAux = [];
    for (let i = 0; i < 35; i++) {
      console.log(0);
      arrayAux.push({
        codigo: "",
        descripcion: "",
        cantidad: "",
        precio: "",
        total: "",
      });
    }
    setInputsArray(arrayAux);
  }, []);
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name == "motivo") {
      if (value == "Producto no de inventario") {
        setColumnasActivas(noInvetario);
      } else {
        setColumnasActivas(allColEnable);
      }
      setVentaPerdida((prevState) => ({
        ...initialVentaPerdida,
        motivo: value,
      }));
    } else {
      setVentaPerdida((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <CajaContenedora className="anchoCompleto">
      <CajaTitulo>
        <Titulo>Por favor ingrese la lista de articulos</Titulo>
      </CajaTitulo>
      <CajaHeadLista>
        <CajaDetalles className="lista">
          <TituloCaja>Motivo</TituloCaja>
          <MenuSimple
            name="motivo"
            value={ventaPerdida.motivo}
            onChange={(e) => handleInputs(e)}
            className="clearModern"
          >
            <Opciones disabled value={""}>
              Seleccione motivo
            </Opciones>
            {MotivoPerdida.map((motivo, index) => {
              return (
                <Opciones key={index} value={motivo}>
                  {motivo}
                </Opciones>
              );
            })}
          </MenuSimple>
        </CajaDetalles>
        {ventaPerdida.motivo != "" && (
          <>
            <CajaDetalles className="lista">
              <TituloCaja>Observaciones</TituloCaja>
              <TextArea2
                placeholder="Observaciones"
                name="observaciones"
                onChange={(e) => handleInputs(e)}
                value={ventaPerdida.observaciones}
                className="lista clearModern"
              />
            </CajaDetalles>
            <CajaDetalles className="lista">
              <TituloCaja>Cliente</TituloCaja>
              <InputSimple
                placeholder="Cliente"
                name="cliente"
                onChange={(e) => handleInputs(e)}
                value={ventaPerdida.Cliente}
                className="lista clearModern"
              />
            </CajaDetalles>
            <CajaDetalles className="lista btnLista">
              <BtnSimple
                name="listaArticulos"
                onClick={(e) => enviarObjeto(e)}
                className="lista enviar"
              >
                Enviar
              </BtnSimple>
            </CajaDetalles>
          </>
        )}
      </CajaHeadLista>{" "}
      <ParrafoTabla>
        Puedes copiar y pegar una tabla desde SAP o desde Excel.
      </ParrafoTabla>
      <TablaExcel
        ventaPerdida={ventaPerdida}
        ListaArticulos={ListaArticulos}
        columnasActivas={columnasActivas}
        inputsArray={inputsArray}
        setValueTabla={setValueTabla}
      />
    </CajaContenedora>
  );
}
const ParrafoTabla = styled.p`
  width: 100%;
  color: ${Tema.complementary.warning};
`;
const CajaContenedora = styled.div`
  border: 1px solid white;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(15px);

  border-radius: 5px;
  width: 65%;
  padding: 10px;
  &.anchoCompleto {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    width: 90%;
    margin-bottom: 100px;
  }
`;

const CajaDetalles = styled.div`
  /* border: 1px solid white; */
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  margin-bottom: 15px;
  &.boton {
    margin-top: 20px;
  }
  &.lista {
    width: 25%;
    /* border: 1px solid blue; */
    margin: 0;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 800px) {
      width: 60%;
    }
    @media screen and (max-width: 500px) {
      width: 70%;
    }
    @media screen and (max-width: 400px) {
      width: 90%;
    }
    &.btnLista {
      width: auto;
    }
  }
  &.tabla {
    width: 100%;
  }
  @media screen and (max-width: 850px) {
    width: 90%;
  }
`;
const TituloCaja = styled.p``;

const TextArea2 = styled(TextArea)`
  border: none;
  min-height: 70px;
  outline: none;
  border-radius: 4px;
  padding: 5px;
  resize: vertical;
  width: 100%;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.lista {
    min-height: 35px;
    max-height: 200px;
    height: 35px;
  }
  &.tabla {
    width: 180px;
  }
  @media screen and (max-width: 800px) {
    /* width: 220px; */
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: 50%;
  margin: auto;
  &.lista {
    position: relative;
    top: 10px;
  }
`;
const MenuSimple = styled(MenuDesplegable)`
  height: 35px;
`;
const DataList = styled.datalist`
  width: 150%;
`;

const Opcion = styled.option``;
const CajaHeadLista = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    /* width: 90%; */
    flex-direction: column;
  }
`;
const ContainerMaster = styled.div`
  position: relative;
  min-height: 100dvh;
  /* display: grid;
  grid-template-rows: auto 1fr auto; */

  display: flex;
  flex-direction: column;
`;

const ContainerSecciones = styled.div`
  &.contenido {
    width: 100%;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
  }
`;
const Span = styled.span`
  color: ${ClearTheme.complementary.warningClear};
  font-size: 1.1rem;
`;

const CajaTitulo = styled.div`
  width: 100%;
  padding: 15px;
`;
const Titulo = styled.h2`
  color: white;
  text-decoration: underline;
`;
const CajaBtnHead = styled.div`
  width: 100%;
  margin-bottom: 15px;
  padding-left: 30px;
  padding-top: 15px;
`;
const InputSimple = styled(InputSimpleEditable)`
  height: 35px;
  /* width: 100%; */
`;
