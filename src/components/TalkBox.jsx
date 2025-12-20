import React from "react";
import { Tema } from "../config/theme";
import avatarMale from "./../../public/img/avatares/maleAvatar.svg";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { BtnNormal } from "./BtnNormal";

export default function TalkBox({ talk, userMaster }) {
  return (
    <CajaResena>
      <CajaAvatar>
        <Enlaces to={"/perfiles/" + talk.user}>
          <Avatar
            className={talk.avatar ? "" : "sinFoto"}
            src={talk.avatar ? talk.avatar : avatarMale}
          />
        </Enlaces>
      </CajaAvatar>
      <CajaTextoResena>
        <Enlaces to={"/perfiles/" + talk.user}>
          <NombreResena>{talk.nombre + " " + talk.apellido}</NombreResena>
        </Enlaces>

        {talk.editando ? (
          <InputSencillo
          // data-id={talk.id}
          // className="editando"
          // name="editando"
          // value={masterResennia.speech}
          // onChange={(e) => handleInput(e)}
          />
        ) : (
          <TextoResena>{talk.texto}</TextoResena>
        )}
        <FechaResennias>{talk.fecha?.slice(0, 10)}</FechaResennias>
      </CajaTextoResena>
      <>
        {talk.user == userMaster.userName && (
          <CajaBtn>
            {talk.editando == false ? (
              <>
                <BtnNormal
                  //   data-id={talk.id}
                  //   data-index={index}
                  //   onClick={(e) => funcionAdvert(e)}
                  className="danger"
                >
                  Eliminar
                </BtnNormal>
                <BtnNormal
                // data-id={talk.id}
                // onClick={(e) => editarResennia(e)}
                >
                  Editar
                </BtnNormal>
              </>
            ) : (
              <>
                <BtnNormal
                  data-id={talk.id}
                  onClick={(e) => cancelarEdicion(e)}
                  className="danger"
                >
                  Cancelar
                </BtnNormal>
                <BtnNormal
                  data-id={talk.id}
                  data-index={talk.index}
                  onClick={(e) => guardarEdicion(e)}
                >
                  Guardar
                </BtnNormal>
              </>
            )}
          </CajaBtn>
        )}
      </>
    </CajaResena>
  );
}

const CajaResena = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 10px 0 10px 0;
  border: 1px solid transparent;
  transition: all ease 0.2s;
  &:hover {
    /* border: 1px solid rgba(255, 184, 5, 0.75); */
    box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
    -webkit-box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
    -moz-box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
  }

  @media screen and (max-width: 780px) {
    flex-direction: column;
    align-items: center;
    border: 1px solid ${Tema.secondary.azulGraciel};
  }
`;
const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  object-fit: contain;
  &.sinFoto {
    filter: grayscale(100%);
  }
  &:hover {
    cursor: pointer;
  }
`;
const CajaTextoResena = styled.div`
  display: flex;
  width: 100%;
  padding-left: 10px;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 780px) {
    padding-left: 0;
  }
`;

const NombreResena = styled.h2`
  color: #fff;
  color: ${Tema.primary.azulBrillante};
  font-size: 1rem;
  margin-bottom: 5px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  @media screen and (max-width: 780px) {
    text-align: center;
  }
`;
const TextoResena = styled.p`
  color: #fff;
  color: ${Tema.neutral.blancoHueso};
  margin-bottom: 8px;
  padding-left: 5px;
`;
const FechaResennias = styled.p`
  color: ${Tema.primary.grisNatural};
  font-size: 14px;
  padding-left: 5px;
  margin-bottom: 10px;
`;

const InputSencillo = styled.textarea`
  background-color: transparent;
  color: white;
  padding: 5px;
  resize: none;

  width: 100%;
  height: 90px;
  font-size: 0.9rem;

  text-align: start;
  align-items: center;
  outline: none;
  border: none;
  &.editando {
    border: 1px solid ${Tema.secondary.azulGraciel};
    background-color: ${Tema.primary.azulBrillante};
    border-radius: 5px;
    color: ${Tema.primary.azulBrillante};
    &:focus {
      border: 1px solid ${Tema.primary.azulBrillante};
    }
  }
`;

const CajaBtn = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 780px) {
    flex-direction: row;
  }
  @media screen and (max-width: 350px) {
    flex-direction: column;
  }
`;

const CajaAvatar = styled.div`
  height: 80px;
`;

const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
