import styled from "styled-components";

import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import {
  faBroom,
  faCalendar,
  faDiamond,
  faEnvelope,
  faPaperclip,
  faPencil,
  faPuzzlePiece,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema } from "../../config/theme";
import { ParrafoAction } from "../../components/JSXElements/GrupoTabla";

export const ControlesTabla = ({
  isEditando,
  crearFurgon,
  docMaster,
  modo,
  editar,
  cancelar,
  guardarCambios,
  limpiarTabla,
  costearBL,
  notificacion,
  mostrarModalNoti,
  cambioFecha,
  cambioFechaFunct,
  partidas,
  activarPartidas,
  adjuntos,
  mostrarAdjuntos,
  verPartidas,
}) => {
  return (
    <CajaBotones>
      {modo !== "detalleFurgon" && modo !== "detalleItem" && (
        <>
          {isEditando == false ? (
            <>
              <BtnNormal
                type="button"
                className={
                  docMaster?.eliminated == true ? "editaEliminada" : ""
                }
                onClick={() => editar()}
              >
                <Icono icon={faPencil} />
                Editar
              </BtnNormal>
              {notificacion && (
                <BtnNormal
                  type="button"
                  className="correo"
                  onClick={() => mostrarModalNoti()}
                >
                  <Icono icon={faEnvelope} />
                  Email
                </BtnNormal>
              )}
              {cambioFecha && (
                <BtnNormal
                  type="button"
                  className="correo"
                  onClick={() => cambioFechaFunct()}
                >
                  <Icono icon={faCalendar} />
                  Fecha
                </BtnNormal>
              )}

              {partidas && (
                <BtnNormal
                  type="button"
                  className="correo"
                  onClick={() => activarPartidas()}
                  title="Proyecciones"
                >
                  <Icono icon={faDiamond} />
                  Proyecc.
                </BtnNormal>
              )}
              {adjuntos && (
                <BtnNormal
                  type="button"
                  className="correo"
                  onClick={() => mostrarAdjuntos()}
                  title="Archivos adjunto"
                >
                  <Icono icon={faPaperclip} />
                  Adjuntos
                </BtnNormal>
              )}
            </>
          ) : (
            <>
              <BtnNormal
                type="button"
                className={
                  docMaster?.eliminated == true ? "editaEliminada" : ""
                }
                onClick={() => guardarCambios()}
              >
                <Icono icon={faFloppyDisk} />
                Guardar
              </BtnNormal>

              <BtnNormal
                type="button"
                className={
                  docMaster?.eliminated == true
                    ? "eliminadaRealizado"
                    : "borrada"
                }
                onClick={() => cancelar()}
              >
                <Icono icon={faXmark} />
                Cancelar
              </BtnNormal>
            </>
          )}
        </>
      )}

      {isEditando && modo == "detalleBL" ? (
        <>
          {docMaster.tipo === 0 && (
            <BtnNormal
              name="adicionar"
              onClick={(e) => crearFurgon(e)}
              className="mas"
            >
              +
            </BtnNormal>
          )}
          <BtnNormal
            name="adicionar"
            onClick={(e) => costearBL(e)}
            className="costear"
          >
            Costear
          </BtnNormal>
        </>
      ) : isEditando && modo == "ordenCompra" ? (
        <>
          <BtnNormal
            name="limpiarTabla"
            onClick={(e) => limpiarTabla(e)}
            className="limpiarTabla"
          >
            <Icono icon={faBroom} />
            Limpiar
          </BtnNormal>
        </>
      ) : (
        ""
      )}
      {modo == "detalleBL" && docMaster.tipo === 1 && (
        <BtnNormal
          name="adicionar"
          onClick={(e) => verPartidas()}
          className="costear"
        >
          <Icono icon={faPuzzlePiece} />
          Partidas
        </BtnNormal>
      )}
    </CajaBotones>
  );
};

const CajaBotones = styled.div`
  /* background-color: ${Tema.secondary.azulProfundo}; */
  padding-left: 15px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
`;
const BtnNormal = styled(BtnGeneralButton)`
  &.borrada {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
  }
  &.eliminadaRealizado {
    background-color: #eaa5a5;
    &:hover {
      cursor: default;
      color: white;
    }
  }
  &.editaEliminada {
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar {
    margin: 0;
  }
  &.editando {
    background-color: #5e5d60;
    color: black;
    cursor: default;
  }
  &.mas {
    width: 50px;
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const Texto = styled.h2`
  color: inherit;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;
`;
const InputBuscar = styled.input`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.primary.azulBrillante};
  margin-right: 5px;
  &.deshabilitado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;

const ContenedorBuscar = styled.div`
  background-color: ${Tema.secondary.azulGraciel};
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  color: ${Tema.primary.azulBrillante};
  &.editando {
    background-color: #5e5d60;
    color: black;
  }
`;
// 206
