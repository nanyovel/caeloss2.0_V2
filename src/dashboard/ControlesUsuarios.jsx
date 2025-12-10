import styled from "styled-components";
import { Tema } from "../config/theme.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import {
  faMagnifyingGlass,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { MenuDesplegable, Opciones } from "../components/InputGeneral.jsx";
import { useEffect } from "react";

export const ControlesUsuarios = ({
  modoEditar,
  editar,
  guardarCambios,
  handleInputControles,
  rolesGlobal,
}) => {
  return (
    <CajaBotones>
      {modoEditar == false ? (
        <>
          <BtnNormal name="editar" type="button" onClick={(e) => editar(e)}>
            <Icono icon={faPencil} />
            Editar
          </BtnNormal>
        </>
      ) : (
        <>
          <BtnNormal
            type="button"
            // className={docMaster?.eliminated==true?'editaEliminada':''}
            onClick={() => guardarCambios()}
          >
            <Icono icon={faFloppyDisk} />
            Guardar
          </BtnNormal>

          <BtnNormal
            type="button"
            className={"borrada"}
            name="cancelar"
            onClick={(e) => editar(e)}
          >
            <Icono icon={faXmark} />
            Cancelar
          </BtnNormal>
        </>
      )}

      <CajaMenuDesp>
        <MenuDesp
          onChange={(e) => handleInputControles(e)}
          // value={}
        >
          <Opciones>Seleccione rol</Opciones>
          {rolesGlobal.map((rol, index) => {
            return <Opciones key={index}>{rol.nombre}</Opciones>;
          })}
        </MenuDesp>
      </CajaMenuDesp>
    </CajaBotones>
  );
};
const CajaBotones = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  padding-left: 15px;
  display: flex;
  align-items: center;
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

const CajaMenuDesp = styled.div``;
const MenuDesp = styled(MenuDesplegable)``;
