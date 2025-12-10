import styled from "styled-components";
import { ClearTheme, Theme } from "../config/theme";
import { Detalle1Wrap, Detalle2Titulo } from "./JSXElements/GrupoDetalle";
import { InputSimpleEditable } from "./InputGeneral";
import { BtnGeneralButton } from "./BtnGeneralButton";
import { TodosLosCorreosCielosDB } from "./corporativo/TodosLosCorreosCielosDB";

export function DestinatariosCorreo({
  modoDisabled,
  arrayDestinatarios,
  addDestinatario,
  handleInputDestinatario,
  guardarDestinatario,
  funcionGuardarDesactivada,
}) {
  const listaCorreosDB = TodosLosCorreosCielosDB;
  return (
    <Contenedor>
      {!modoDisabled && (
        <CajaMasa>
          {arrayDestinatarios?.map((person, index) => {
            return (
              <Detalle5HijoArray key={index}>
                <Detalle1Wrap2>
                  <Detalle2Titulo2>Nombre:</Detalle2Titulo2>
                  <InputEditable
                    type="text"
                    data-tipo="destinatarios"
                    value={person.nombre}
                    name="nombre"
                    autoComplete="off"
                    className={"clearModern"}
                    onChange={(e) => {
                      handleInputDestinatario(e);
                    }}
                    data-index={index}
                    list="nombresCorreosDB"
                  />
                  <DataList id="nombresCorreosDB">
                    {listaCorreosDB.map((usuario, index) => {
                      return (
                        <Opcion
                          data-correo={usuario.correo}
                          value={usuario.nombre}
                          key={index}
                        >
                          {usuario.correo}
                        </Opcion>
                      );
                    })}
                  </DataList>
                </Detalle1Wrap2>

                <Detalle1Wrap2>
                  <Detalle2Titulo2>Correo:</Detalle2Titulo2>

                  <InputEditable
                    data-tipo="destinatarios"
                    value={person.correo}
                    name="correo"
                    autoComplete="off"
                    className={"clearModern"}
                    list="correosDB"
                    onChange={(e) => {
                      handleInputDestinatario(e);
                    }}
                    data-index={index}
                  />
                  <DataList id="correosDB">
                    {listaCorreosDB.map((usuario, index) => {
                      return (
                        <Opcion
                          data-nombre={usuario.nombre}
                          value={usuario.correo}
                          key={index}
                        >
                          {usuario.nombre}
                        </Opcion>
                      );
                    })}
                  </DataList>
                </Detalle1Wrap2>
              </Detalle5HijoArray>
            );
          })}
        </CajaMasa>
      )}
      {modoDisabled && (
        <CajaTablaGroup2>
          <TablaGroup>
            <thead>
              <FilasGroup>
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                <CeldaHeadGroup>Correo</CeldaHeadGroup>
              </FilasGroup>
            </thead>
            <tbody>
              {arrayDestinatarios?.map((person, index) => {
                return (
                  <FilasGroup
                    key={index}
                    className={`body ${index % 2 ? "impar" : "par"}`}
                  >
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>{person.nombre}</CeldasBodyGroup>
                    <CeldasBodyGroup>{person.correo}</CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
        </CajaTablaGroup2>
      )}
      <CajaBtn className="cajaBtn">
        <BtnSimple
          name="add"
          onClick={(e) => addDestinatario(e)}
          data-action="add"
        >
          +
        </BtnSimple>
        <BtnSimple
          name="minus"
          onClick={(e) => addDestinatario(e)}
          data-action="remove"
        >
          -
        </BtnSimple>
        {!funcionGuardarDesactivada && (
          <BtnSimple
            name="minus"
            onClick={(e) => guardarDestinatario(e)}
            data-action="remove"
          >
            Guardar
          </BtnSimple>
        )}
      </CajaBtn>
    </Contenedor>
  );
}

const Contenedor = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.grisCielos};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Detalle1Wrap2 = styled(Detalle1Wrap)`
  height: 30px;
  border: none;
  border-radius: 4px;
  background-color: ${ClearTheme.secondary.azulVerdeClaro};
  margin-bottom: 2px;
  color: ${ClearTheme.neutral.neutral600};
  &:hover {
    background-color: ${ClearTheme.secondary.azulVerdeClaro};
    color: ${ClearTheme.neutral.neutral600};
  }
`;
const Detalle2Titulo2 = styled(Detalle2Titulo)`
  border-radius: 4px;
  height: 100%;
  align-content: center;
  padding-left: 8px;
`;
const CajaBtn = styled.div`
  display: flex;

  background-color: transparent;
  justify-content: center;
  height: 60px;
`;
const BtnSimple = styled(BtnGeneralButton)`
  min-width: 100px;

  width: 120px;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  height: 30px;
`;
const CajaMasa = styled.div`
  height: calc(100% - 60px);
`;
const InputEditable = styled(InputSimpleEditable)`
  height: 29px;
  min-height: 25px;
  width: 50%;
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;
  margin: 0;
  &.disabled {
    background-color: ${Theme.primary.grisNatural};
    color: #000;
  }
`;
const DataList = styled.datalist`
  background-color: red;
  width: 150%;
`;
const Opcion = styled.option`
  background-color: red;
`;
const Detalle5HijoArray = styled.div`
  margin-bottom: 4px;
`;
