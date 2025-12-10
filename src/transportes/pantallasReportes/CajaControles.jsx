import React, { useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../config/theme";
import { InputSimpleEditable } from "../../components/InputGeneral";
import ImgArfiler from "./../../../public/img/icon/alfiler.png";
import ImgLapiz from "./../../../public/img/icon/editar.png";
import ImgAll from "./../../../public/img/icon/todo-incluido.png";
import { OpcionUnica } from "../../components/OpcionUnica";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { faDatabase, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alerta } from "../../components/Alerta";
import { ModalLoading } from "../../components/ModalLoading";

export default function CajaControles({
  fetchGetDocs,
  traerDatosXDptop,
  handleInputs,
  arrayOpcionesMisReq,
  handleOpcionesMisReq,
  setArrayOpcionesMisReq,
  valueInput,
  proyFixed,
  setProyFixed,
  setValueInput,
  arrayOpciones,
}) {
  // ********** RECURSOS GENERALES **********
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const fijarProyecto = (e) => {
    const { name, value } = e.target;

    if (name == "fijarProy") {
      if (valueInput.numProy == "") {
        setMensajeAlerta("Ingresar numero de proyecto.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      setProyFixed(true);
    } else if (name == "modificar") {
      setProyFixed(false);
    } else if (name == "allProy") {
      setProyFixed(true);
      setValueInput({
        ...valueInput,
        numProy: "Todos",
      });
    }
  };

  const llamarDB = (e) => {
    const { value, name } = e.target;
    const icono = e.target.closest("svg"); // Asegúrate de que el clic es dentro del svg
    const nombreIcono = icono ? icono.dataset.nombre : null;

    if (
      arrayOpciones.find((opcion) => opcion.select).code == "proyectos" &&
      proyFixed == false
    ) {
      setMensajeAlerta("Debe fijar un numero de proyecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    traerDatosXDptop(name == "exportarExcel");
    // fetchGetDocs("transferRequest", name == "exportarExcel");
    if (nombreIcono == "enLinea" || name == "enLinea") {
    } else if (nombreIcono == "exportarExcel" || name == "exportarExcel") {
    }
  };

  // ************* GENERAL EXCEL *************
  // const generalReporte = async () => {
  //   console.log("llego!!!!");
  //   const hasPermiso = userMaster.permisos.includes("generalReportsTMS");
  //   if (!hasPermiso) {
  //     console.log("salir");
  //     return;
  //   }
  //   if (fechaInicialES6 == "" || fechaFinalES6 == "") {
  //     setMensajeAlerta("Colocar el rango de fecha correctamente.");
  //     setTipoAlerta("warning");
  //     setDispatchAlerta(true);
  //     setTimeout(() => setDispatchAlerta(false), 3000);
  //     return;
  //   }
  //   try {
  //     const listaBuscada = await fetchGetDocs("transferRequest");
  //     console.log(listaBuscada);

  //     ExportarExcel(listaBuscada, ColumnasReqExcel);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <Container>
      <WrapInput>
        <TituloProy>Mis solicitudes</TituloProy>
        <CajaProyecto>
          <OpcionUnica
            arrayOpciones={arrayOpcionesMisReq}
            handleOpciones={handleOpcionesMisReq}
            setArrayOpciones={setArrayOpcionesMisReq}
            sinMarginTopBottom={true}
          />
        </CajaProyecto>
      </WrapInput>
      {arrayOpciones.find((opcion) => opcion.select).code == "proyectos" && (
        <WrapInput>
          <TituloProy>N° proyecto</TituloProy>
          <CajaProyecto>
            <InputEditable
              type="text"
              value={valueInput.numProy}
              name="numProy"
              autoComplete="off"
              disabled={proyFixed}
              className={`${proyFixed ? " disabled " : ""}`}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
            <Img
              title="Todos los proyectos."
              className="allProy"
              name="allProy"
              src={ImgAll}
              onClick={(e) => {
                fijarProyecto(e);
              }}
            />
            {proyFixed == false ? (
              <Img
                title="Fijar proyecto."
                name="fijarProy"
                src={ImgArfiler}
                onClick={(e) => {
                  fijarProyecto(e);
                }}
              />
            ) : (
              <Img
                title="Editar proyecto."
                name="modificar"
                src={ImgLapiz}
                onClick={(e) => {
                  fijarProyecto(e);
                }}
              />
            )}
          </CajaProyecto>
        </WrapInput>
      )}
      {/* <WrapInput>
        <TituloProy>Buscar</TituloProy>
        <CajaProyecto>
          <InputEditable
            type="text"
            value={valueInput.search}
            name="search"
            autoComplete="off"
            onChange={(e) => {
              handleInputs(e);
            }}
          />
        </CajaProyecto>
      </WrapInput> */}

      <WrapInput>
        <BtnSimple name="enLinea" onClick={(e) => llamarDB(e)}>
          <Icono
            name="enLinea"
            data-nombre="enLinea"
            onClick={(e) => llamarDB(e)}
            icon={faDatabase}
          />
          En linea
        </BtnSimple>
        <BtnSimple name="exportarExcel" onClick={(e) => llamarDB(e)}>
          <Icono
            data-nombre="exportarExcel"
            name="exportarExcel"
            onClick={(e) => llamarDB(e)}
            data-name="asdda"
            icon={faFileExport}
          />
          Exportar
        </BtnSimple>
      </WrapInput>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  padding: 5px;
  padding-left: 10px;
  height: auto;
  background-color: ${ClearTheme.primary.azulBrillante};
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  display: flex;
  gap: 5px;
`;
const WrapInput = styled.div`
  /* border: 1px solid red; */
`;
const CajaProyecto = styled.div`
  position: relative;
`;
const InputEditable = styled(InputSimpleEditable)`
  height: 30px;
  width: 120px;
  min-width: 150px;
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;
  margin: 0;
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: #000;
  }
`;

const Img = styled.img`
  position: absolute;
  width: 1.5rem;
  color: ${Tema.primary.azulBrillante};
  top: 50%;
  right: 1px;
  transform: translate(0, -50%);
  cursor: pointer;
  border: 1px solid ${Tema.primary.grisNatural};
  padding: 2px;
  border-radius: 4px;
  &.allProy {
    right: 1.5rem;
  }
`;
const TituloProy = styled.p`
  color: white;
  text-decoration: underline;
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 0;
  transform: translate(0, 50%);
`;
const ImgButton = styled.img`
  height: 20px;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;
