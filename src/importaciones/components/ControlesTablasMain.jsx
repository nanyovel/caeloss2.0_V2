import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral";
import { OpcionUnica } from "../../components/OpcionUnica";

export const ControlesTablasMain = ({
  handleSearch,
  buscarDocInput,
  destinoDocInput,
  listDestinos,
  habilitar,
  handleDestino,
  tipo,
}) => {
  const statusFurgones = [
    {
      nombre: "Proveedor",
      valor: "0",
    },
    {
      nombre: "Transito Maritimo",
      valor: "1",
    },
    {
      nombre: "En Puerto",
      valor: "2",
    },
    {
      nombre: "Recepcion Almacen",
      valor: "3",
    },
    {
      nombre: "Dpto Importaciones",
      valor: "4",
    },
    {
      nombre: "Concluido en SAP✅",
      valor: "5",
    },
  ];

  return (
    <Container className={tipo}>
      <ContenedorInputTextMenuDesplegable className={tipo}>
        {habilitar?.search && (
          <ContenedorInputs
            className={`
                   ${tipo}
                   `}
          >
            {/* <TituloBuscar
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              Buscar
            </TituloBuscar> */}
            <InputBuscar
              onChange={(e) => handleSearch(e)}
              placeholder="Buscar"
              value={buscarDocInput}
              name={"inputBuscar"}
              className={`
                       ${Theme.config.modoClear ? "clearModern" : ""}
                       ${tipo}
                       `}
              autoComplete="off"
            />
          </ContenedorInputs>
        )}

        {habilitar?.status && (
          <ContenedorInputs className={tipo}>
            {/* <TituloBuscar>Status</TituloBuscar> */}
            <MenuDesplegable2
              onChange={(e) => {
                handleSearch(e);
              }}
              name="cicloVida"
              className={`${Theme.config.modoClear ? "clearModern" : ""} ${tipo}`}
              autoComplete="off"
            >
              <Opciones2
                className={`${Theme.config.modoClear ? "clearModern" : ""}${tipo}`}
                value=""
              >
                Todos
              </Opciones2>

              {statusFurgones.map((opcion, index) => {
                return (
                  <Opciones2
                    key={index}
                    className={`${Theme.config.modoClear ? "clearModern" : ""}${tipo}`}
                    value={opcion.valor}
                    disabled={
                      opcion.nombre == "Proveedor" ||
                      opcion.nombre == "Concluido en SAP✅"
                    }
                  >
                    {opcion.nombre}
                  </Opciones2>
                );
              })}
            </MenuDesplegable2>
          </ContenedorInputs>
        )}

        {habilitar?.destino && (
          <ContenedorInputs className={tipo}>
            {/* <TituloBuscar>Destino</TituloBuscar> */}
            <MenuDesplegable2
              className={`${Theme.config.modoClear ? "clearModern" : ""} ${tipo}`}
              onChange={
                tipo == "enPuerto" || tipo == "almacen"
                  ? (e) => {
                      handleDestino(e);
                    }
                  : (e) => {
                      handleSearch(e);
                    }
              }
              name="destino"
              value={destinoDocInput}
            >
              <Opciones2 value="" disabled>
                Destinos
              </Opciones2>
              <Opciones2 value="">Todos</Opciones2>
              {listDestinos.map((dest, index) => {
                return (
                  <Opciones2
                    className={`${Theme.config.modoClear ? "clearModern" : ""}${tipo}`}
                    key={index}
                    value={dest.toLowerCase()}
                  >
                    {dest}
                  </Opciones2>
                );
              })}
            </MenuDesplegable2>
          </ContenedorInputs>
        )}
      </ContenedorInputTextMenuDesplegable>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  margin-top: 8px;
  /* max-width: 1000px; */
  width: 100%;
  border: 1px solid transparent;
  /* border: 1px solid red; */
  width: 100%;
  padding: 0 30px;
  justify-content: start;
  &.articulo {
    justify-content: start;
  }
  @media screen and (max-width: 620px) {
    flex-direction: column;
  }
  &.proveedor {
    justify-content: start;
    @media screen and (max-width: 700px) {
      display: flex;
      flex-direction: column;
    }
  }
  &.transito {
    @media screen and (max-width: 900px) {
      flex-direction: column;
    }
  }

  display: flex;
  align-items: end;
  &.enPuerto {
    /* flex-wrap: wrap; */
    @media screen and (max-width: 850px) {
      display: flex;
      flex-direction: column;
      padding-right: 0;
    }
  }
  &.enPuertoAvanzar {
    padding: 5px 2px;
    @media screen and (max-width: 850px) {
      display: flex;
      flex-direction: column;
      padding-right: 0;
    }
  }
  &.almacen {
    justify-content: start;
    @media screen and (max-width: 830px) {
      display: flex;
      justify-content: start;
      padding: 0;
    }
    @media screen and (max-width: 620px) {
      display: flex;
      flex-direction: row;
    }
    @media screen and (max-width: 480px) {
      display: flex;
      flex-direction: column;
    }
  }
  &.import {
    @media screen and (max-width: 630px) {
      flex-direction: row;
    }
    @media screen and (max-width: 450px) {
      flex-direction: column;
    }
  }
  background-color: #163f5073;
  background-color: transparent;
`;
const CajaParametro = styled.div`
  display: flex;
  &.articulo {
    @media screen and (max-width: 860px) {
      width: 49%;
    }

    @media screen and (max-width: 700px) {
      width: 50%;
    }
    @media screen and (max-width: 680px) {
      width: 40%;
    }
    @media screen and (max-width: 620px) {
      width: 100%;
      margin-bottom: 5px;
    }
    @media screen and (max-width: 460px) {
      width: 100%;
      padding-left: 0 10px;
    }
    min-width: 190px;
  }
  &.proveedor {
    margin-right: 5px;
    @media screen and (max-width: 700px) {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
  &.transito {
    margin-right: 5px;
    @media screen and (max-width: 900px) {
      margin-bottom: 5px;
    }
    @media screen and (max-width: 310px) {
      flex-wrap: wrap;
      width: 100%;
      padding-left: 0 10px;
    }
  }
  &.enPuerto {
    @media screen and (max-width: 460px) {
      flex-wrap: wrap;
      width: 100%;
      padding-left: 0 10px;
    }
    @media screen and (max-width: 850px) {
      margin-bottom: 5px;
    }
  }
  &.almacen {
    margin-right: 5px;
    @media screen and (max-width: 480px) {
      flex-wrap: wrap;
      margin-bottom: 5px;
    }
  }
  &.import {
    margin-right: 5px;
  }

  @media screen and (max-width: 200px) {
    flex-wrap: wrap;
  }
`;

const Radio = styled.input`
  display: none;
`;

const ContenedorInputTextMenuDesplegable = styled.div`
  display: flex;

  &.articulo {
    @media screen and (max-width: 860px) {
      width: 49%;
      flex-direction: column;
    }
    @media screen and (max-width: 700px) {
      width: 50%;
    }
    @media screen and (max-width: 680px) {
      width: 60%;
    }
    @media screen and (max-width: 620px) {
      width: 100%;
      flex-direction: row;
    }
    @media screen and (max-width: 390px) {
      width: 100%;
      flex-direction: column;
      padding-left: 10px;
    }
  }
  &.contenedores {
    @media screen and (max-width: 820px) {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
  &.enPuerto {
    /* @media screen and (max-width:820px) { */
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* } */
  }
  &.almacen {
    @media screen and (max-width: 720px) {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  margin-right: 5px;
`;

const ContenedorInputs = styled.div`
  background-color: inherit;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  &.btns {
    display: flex;
    align-items: end;
    justify-content: end;
    flex-direction: row;
    gap: 10px;
  }
  @media screen and (max-width: 800px) {
    height: auto;
    margin-bottom: 4px;
    border: 1px solid gray;
    padding: 3px;
  }
`;

const InputBuscar = styled(InputSimpleEditable)`
  height: 25px;
`;
const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 4px;
  background-color: ${Tema.secondary.azulGraciel};
  height: 25px;
  width: 150px;
  color: ${Tema.primary.azulBrillante};
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: inherit;
    color: inherit;
  }
`;
const Opciones2 = styled(Opciones)``;
