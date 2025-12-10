import styled from "styled-components";

import { Tema } from "../../../../config/theme";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";

export default function Comentarios({ productMaster, userMaster }) {
  const comentarios = productMaster.comentarios;
  return (
    <>
      <Container>
        {/* {userMaster && (
          <CajaComments>
            {comentarios.map((comment, index) => {
              return (
                <TalkBox key={index} talk={comment} userMaster={userMaster} />
              );
            })}
          </CajaComments>
        )} */}
      </Container>
      <CajaNewComment>
        <CajaFotoPerfil>
          <FotoPerfil src={userMaster?.urlFotoPerfil || ""} />
        </CajaFotoPerfil>
        <CajaInput>
          <TextArea />
          <CajaBtn>
            <BtnSimple>Cancelar</BtnSimple>
            <BtnSimple>Aceptar</BtnSimple>
          </CajaBtn>
        </CajaInput>
      </CajaNewComment>
    </>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
  border: 1px solid ${Tema.primary.azulBrillante};
  padding: 8px;
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaComments = styled.div``;

const CajaNewComment = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
`;
const CajaFotoPerfil = styled.div`
  width: 10%;
  height: 100%;
  justify-content: center;
  display: flex;
  padding-top: 10px;
`;
const FotoPerfil = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
const CajaInput = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid black;
`;
const CajaInputInt = styled.div`
  /* border: 2px solid red; */
  width: 90%;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 60%;
  outline: none;
  border: none;
  padding: 10px;
  resize: none;
  background: none;
  color: ${Tema.primary.azulBrillante};
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;
const CajaBtn = styled.div``;
const BtnSimple = styled(BtnGeneralButton)``;
