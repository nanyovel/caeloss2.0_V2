import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuDesplegable, Opciones } from "../../components/InputGeneral";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema, Theme } from "../../config/theme";

export default function ControlesPagoTabla({
  datosMolde,
  controles,
  handleFiltros,
}) {
  return (
    <Container className={Theme.config.modoClear ? "clearModern" : ""}>
      <TituloEncabezadoTabla
        className={Theme.config.modoClear ? "clearModern" : ""}
      >
        {datosMolde.titulo + " " + datosMolde.valoresMoldePadre.tipoChoferes}
      </TituloEncabezadoTabla>
      <WrapFunciones>
        {controles.menuDesplegable.length > 0 &&
          controles.menuDesplegable
            .filter((menuDes) => menuDes.active)

            .map((menuDes, index) => {
              return (
                <ContenedorInputs key={index}>
                  <TituloBuscar
                    className={Theme.config.modoClear ? "clearModern" : ""}
                  >
                    {menuDes.nombre}
                  </TituloBuscar>
                  <MenuDesplegableSenc
                    onChange={(e) => handleFiltros(e)}
                    // value={menuDes.state}
                    name={menuDes.name}
                    autoComplete="off"
                    className={`${Theme.config.modoClear ? "clearModern" : ""}`}
                  >
                    {menuDes.opcionTodos && (
                      <Opciones2 value={0}>Todos</Opciones2>
                    )}
                    {menuDes.opciones.map((opc, index) => {
                      return (
                        <Opciones2
                          key={index}
                          value={opc.descripcion}
                          disabled={opc.disabled}
                          className={`${Theme.config.modoClear ? "clearModern" : ""}`}
                        >
                          {opc.descripcion}
                        </Opciones2>
                      );
                    })}
                  </MenuDesplegableSenc>
                </ContenedorInputs>
              );
            })}

        {controles.btns &&
          controles.btns
            .filter((menuDes) => menuDes.active)
            .map((btn, index) => {
              return (
                <ContenedorInputs className="btns" key={index}>
                  <BtnNormal
                    className={`${btn.tipo + " "}  ${btn.disabled ? " disabled " : ""} 
                              ${btn.disabled ? " disabled " : ""} 
                            `}
                    // onClick={(e) => handleFiltros(e)}
                    onClick={(e) => btn.funcion(btn.tipo)}
                    name={btn.tipo}
                  >
                    <Icono
                      data-name="asdda"
                      name={111}
                      icon={
                        btn.tipo == "btnGuardar"
                          ? faSave
                          : btn.tipo == "btnExportar"
                            ? faFileExport
                            : ""
                      }
                    />

                    {btn.texto}
                  </BtnNormal>
                </ContenedorInputs>
              );
            })}
      </WrapFunciones>
    </Container>
  );
}
const Container = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  width: 100%;
  padding: 5px;
  padding-left: 15px;
  /* border: 2px solid red; */
  /* min-height: 30px; */
  display: flex;
  flex-direction: column;
  align-items: start;
  &.clearModern {
    background-color: ${ClearTheme.primary.azulBrillante};
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }
`;
const WrapFunciones = styled.div`
  display: flex;
`;
const TituloEncabezadoTabla = styled.h2`
  color: #757575;
  font-size: 1.1rem;
  font-weight: normal;
  &.clearModern {
    color: black;
    text-decoration: underline;
  }
`;

const ContenedorInputs = styled.div`
  background-color: ${Tema.secondary.azulOscuro2};
  background-color: inherit;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  height: 40px;
  &.btns {
    display: flex;
    align-items: end;
    justify-content: end;
    flex-direction: row;
    /* gap: 10px; */
  }
`;

const TituloBuscar = styled.h2`
  color: white;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

  color: ${Tema.secondary.azulOpaco};
  &.clearModern {
    color: white;
    font-weight: 400;
  }
`;

const MenuDesplegableSenc = styled(MenuDesplegable)`
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

const Opciones2 = styled(Opciones)`
  border: none;
  background-color: ${Tema.secondary.azulProfundo};
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 5px;
  height: 25px;
  padding: 0;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const BtnNormal = styled(BtnGeneralButton)`
  white-space: nowrap;
  margin: 0;
  margin-right: 5px;
  width: auto;
  &.btnEliminar {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
  }

  &.btnDesactivar {
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    cursor: default;
    &:hover {
      /* color: red; */
      color: white;
      background-color: ${Tema.primary.grisNatural};
    }
  }
`;
