import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";

export const Detalle0Contenedor = styled.div`
  width: 46%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 1px solid ${Tema.primary.grisNatural};
  padding: 2px;
  border-radius: 5px;
  overflow: hidden;
  color: ${Tema.secondary.azulOpaco};
  height: 200px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);

  border: 1px solid white;

  color: white;
  padding: 7px;
  &.img {
    padding: 0;
  }
  &.scroll {
    overflow-y: scroll;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
export const Detalle1Foto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const Detalle1Wrap = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};

  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 25px;
  color: white;
  &.altoAuto {
    height: auto;
    padding-top: 3px;
    padding-bottom: 3px;
  }
  &.scroll {
    overflow-y: scroll;
  }

  &.vertical {
    border-radius: 5px;
    flex-direction: column;
    border: none;

    background-color: ${ClearTheme.secondary.azulVerdeClaro};
    background-color: #2e7db2;
    &.transparent {
      background-color: transparent;
      border: 1px solid transparent;
      transition: all ease 0.3s;
    }
    padding: 4px;
    height: auto;
    border-bottom: 1px solid #3e5871;
    &:hover {
      background-color: ${ClearTheme.secondary.azulVerdeClaro};
      color: white;
      &.transparent {
        border: 1px solid white;
        background-color: transparent;
      }
    }
  }
  &:hover {
    background-color: ${ClearTheme.secondary.azulGris};
    color: #181818;
  }

  &.input {
    height: 30px;
    background-color: ${ClearTheme.secondary.azulVerdeClaro};
    padding: 4px;
    padding-right: 0;
    border-radius: 5px;
    &:hover {
      background-color: ${ClearTheme.secondary.azulVerdeClaro};
      color: white;
    }
  }
  &.danger {
    color: white;
    background-color: #883636;
  }
  @media screen and (max-width: 400px) {
    flex-direction: column;
    height: auto;
  }
`;

export const Detalle2Titulo = styled.p`
  width: 49%;
  height: 100%;
  color: inherit;
  text-align: start;
  min-height: 20px;
  &.corto40-60 {
    width: 40%;
  }
  &.corto30-70 {
    width: 40%;
  }
  &.vertical {
    height: auto;
    /* color: #3e3e3e; */
    width: 100%;
    text-align: start;
    text-decoration: underline;
    min-height: 20px;
  }

  @media screen and (max-width: 400px) {
    width: 100%;
    text-align: start;
    /* text-decoration: underline; */
    min-height: 20px;
    /* font-weight: 600; */
  }
`;

export const Detalle3OutPut = styled.p`
  text-align: end;

  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  min-height: 20px;
  &.ancho60-40 {
    width: 60%;
  }
  &.ancho70-30 {
    width: 70%;
  }
  &.sinAbreviar {
    white-space: nowrap;
    overflow: visible;
    /* text-overflow: ; */
  }
  &.vertical {
    color: inherit;
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    min-height: 45px;
    white-space: normal;
  }
  &.input {
    height: 100%;
  }

  @media screen and (max-width: 400px) {
    color: inherit;
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
`;
export const Detalle3OutPutLista = styled.ul`
  text-align: end;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  min-height: 20px;

  color: inherit;
  width: 100%;
  text-align: start;
  margin-bottom: 4px;
  min-height: 45px;
  white-space: normal;
  padding-left: 35px;
  @media screen and (max-width: 400px) {
    color: inherit;
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
`;
export const Detalle3OutPutElementosLista = styled.li``;

// *********** INPUTS EDITABLE**************
export const Detail1InputWrap = styled(Detalle1Wrap)`
  height: auto;
  margin-bottom: 2px;
  &:hover {
    background-color: transparent;
    color: white;
  }
`;
