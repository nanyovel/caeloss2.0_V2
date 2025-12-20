import styled from "styled-components";
import { Tema } from "../../../../config/theme";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../../components/InputGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import { datoTecnicoSchema } from "../../../schemas/productoSchema";
import { useEffect } from "react";
import { BotonQuery } from "../../../../components/BotonQuery";
import { generarUUID } from "../../../../libs/generarUUID";

export default function DatosTecnicos({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const handleInputs = (e) => {
    const idDataset = e.target.dataset.id;
    const tipoDataset = e.target.dataset.tipo;
    const indexFilaDataset = e.target.dataset.indexfila;
    const indexCeldaDataset = e.target.dataset.indexcelda;
    const { value, name } = e.target;
    if (tipoDataset == "dimensiones") {
      const dimensionesFind = productEditable.datosTecnicos.find(
        (dato) => dato.tipo == "dimensiones"
      );

      const bodyTable = dimensionesFind.bodyTable.map((body, indexF) => {
        if (indexF == indexFilaDataset) {
          const bodyUp = body.map((hijo, indexC) => {
            if (indexC == indexCeldaDataset) {
              return value;
            } else {
              return hijo;
            }
          });

          return [...bodyUp];
        } else {
          return [...body];
        }
      });
      const dimensionesUp = {
        ...dimensionesFind,
        bodyTable: bodyTable,
      };

      const datosTecnicosUp = productEditable.datosTecnicos.map((dato) => {
        if (dato.tipo == "dimensiones") {
          return { ...dimensionesUp };
        } else {
          return { ...dato };
        }
      });

      setProductoEditable({
        ...productEditable,
        datosTecnicos: datosTecnicosUp,
      });
    } else {
      const datosTecnicoUp = productEditable.datosTecnicos.map((dato) => {
        if (dato.idAux == idDataset) {
          return {
            ...dato,
            [name]: value,
          };
        } else {
          return { ...dato };
        }
      });
      setProductoEditable({
        ...productEditable,
        datosTecnicos: datosTecnicoUp,
      });
    }
  };
  const addParrafo = (tipo) => {
    const nuevoDato = {
      ...datoTecnicoSchema,
      tipo: tipo,
      idAux: generarUUID(),
    };

    if (tipo == "dimensiones") {
      const dimensionesFind = productEditable.datosTecnicos.find(
        (dato) => dato.tipo == "dimensiones"
      );

      const dimensionesUp = {
        ...dimensionesFind,
        bodyTable: [...dimensionesFind.bodyTable, ["", "", "", ""]],
      };

      setProductoEditable({
        ...productEditable,
        datosTecnicos: productEditable.datosTecnicos.map((dato) => {
          if (dato.tipo == "dimensiones") {
            return dimensionesUp;
          } else {
            return dato;
          }
        }),
      });
    } else {
      setProductoEditable({
        ...productEditable,
        datosTecnicos: [...productEditable.datosTecnicos, nuevoDato],
      });
    }
  };
  const removeParrafo = (tipo) => {
    const datosThisTipo = productEditable.datosTecnicos.filter(
      (dato) => dato.tipo == tipo
    );
    const datosOther = productEditable.datosTecnicos.filter(
      (dato) => dato.tipo !== tipo
    );
    const datoUp = datosThisTipo.slice(0, -1);

    if (tipo == "dimensiones") {
      const dimensionesFind = productEditable.datosTecnicos.find(
        (dato) => dato.tipo == "dimensiones"
      );
      const dimensionesUp = {
        ...dimensionesFind,
        bodyTable: dimensionesFind.bodyTable.slice(0, -1),
      };
      setProductoEditable({
        ...productEditable,
        datosTecnicos: productEditable.datosTecnicos.map((dato) => {
          if (dato.tipo == "dimensiones") {
            return dimensionesUp;
          } else {
            return dato;
          }
        }),
      });
    } else {
      setProductoEditable({
        ...productEditable,
        datosTecnicos: [...datoUp, ...datosOther],
      });
    }
  };

  return (
    <Container>
      {modoEditar ? (
        <WrapEdit>
          <CajaDetalles>
            <WranInterna>
              {productEditable.datosTecnicos
                .filter((dato, index) => {
                  if (dato.tipo == "row") {
                    return dato;
                  }
                })
                .map((dato, index) => {
                  return (
                    <CajitaDetalle key={index}>
                      <InputSimple
                        name="label"
                        data-id={dato.idAux}
                        data-tipo={dato.tipo}
                        onChange={(e) => handleInputs(e)}
                        value={dato.label}
                      />
                      <InputSimple
                        name="detalles"
                        data-id={dato.idAux}
                        data-tipo={dato.tipo}
                        onChange={(e) => handleInputs(e)}
                        value={dato.detalles}
                      />
                    </CajitaDetalle>
                  );
                })}
              <CajaBtn>
                <BtnGeneralButton onClick={() => removeParrafo("row")}>
                  -
                </BtnGeneralButton>
                <BtnGeneralButton onClick={() => addParrafo("row")}>
                  +
                </BtnGeneralButton>
              </CajaBtn>
            </WranInterna>
            <br />
            <WranInterna>
              {productEditable.datosTecnicos
                .filter((dato, index) => {
                  if (dato.tipo == "vertical") {
                    return dato;
                  }
                })
                .map((dato, index) => {
                  return (
                    <CajitaDetalle key={index} className="vertical">
                      <InputSimple
                        data-id={dato.idAux}
                        name="label"
                        onChange={(e) => handleInputs(e)}
                        value={dato.label}
                        data-tipo={dato.tipo}
                      />
                      <TextArea2
                        data-id={dato.idAux}
                        name="detalles"
                        onChange={(e) => handleInputs(e)}
                        value={dato.detalles}
                        data-tipo={dato.tipo}
                      />
                    </CajitaDetalle>
                  );
                })}
              <CajaBtn>
                <BtnGeneralButton onClick={() => removeParrafo("vertical")}>
                  -
                </BtnGeneralButton>
                <BtnGeneralButton onClick={() => addParrafo("vertical")}>
                  +
                </BtnGeneralButton>
              </CajaBtn>
            </WranInterna>
            <br />
            {productEditable.datosTecnicos
              .filter((dato, index) => {
                if (dato.tipo == "dimensiones") {
                  return dato;
                }
              })
              .map((dato, index) => {
                return (
                  <CajitaDetalle className="vertical" key={index}>
                    <TituloDetalle className="vertical">
                      {dato.label}
                    </TituloDetalle>
                    <CajaTablaGroup>
                      <TablaGroup>
                        <thead>
                          <FilasGroup className="cabeza">
                            {dato.headTable.map((head, index) => {
                              return (
                                <CeldaHeadGroup key={index}>
                                  {head}
                                </CeldaHeadGroup>
                              );
                            })}
                          </FilasGroup>
                        </thead>
                        <tbody>
                          {dato.bodyTable.map((body, indexFila) => {
                            return (
                              <FilasGroup className="body" key={indexFila}>
                                <CeldasBodyGroup>
                                  <InputSimple
                                    value={body.um}
                                    className="celda clearModern"
                                    onChange={(e) => handleInputs(e)}
                                    data-id={dato.idAux}
                                    data-tipo={dato.tipo}
                                    data-indexfila={indexFila}
                                    name="celda"
                                  />
                                </CeldasBodyGroup>
                                <CeldasBodyGroup>
                                  <InputSimple
                                    value={body.ancho}
                                    className="celda clearModern"
                                    onChange={(e) => handleInputs(e)}
                                    data-id={dato.idAux}
                                    data-tipo={dato.tipo}
                                    data-indexfila={indexFila}
                                    name="celda"
                                  />
                                </CeldasBodyGroup>
                                <CeldasBodyGroup>
                                  <InputSimple
                                    value={body.largo}
                                    className="celda clearModern"
                                    onChange={(e) => handleInputs(e)}
                                    data-id={dato.idAux}
                                    data-tipo={dato.tipo}
                                    data-indexfila={indexFila}
                                    name="celda"
                                  />
                                </CeldasBodyGroup>
                                <CeldasBodyGroup>
                                  <InputSimple
                                    value={body.grosor}
                                    className="celda clearModern"
                                    onChange={(e) => handleInputs(e)}
                                    data-id={dato.idAux}
                                    data-tipo={dato.tipo}
                                    data-indexfila={indexFila}
                                    name="celda"
                                  />
                                </CeldasBodyGroup>
                              </FilasGroup>
                            );
                          })}
                        </tbody>
                      </TablaGroup>
                      <CajaBtn>
                        <BtnGeneralButton
                          onClick={() => removeParrafo("dimensiones")}
                        >
                          -
                        </BtnGeneralButton>
                        <BtnGeneralButton
                          onClick={() => addParrafo("dimensiones")}
                        >
                          +
                        </BtnGeneralButton>
                      </CajaBtn>
                    </CajaTablaGroup>
                  </CajitaDetalle>
                );
              })}
          </CajaDetalles>
        </WrapEdit>
      ) : (
        <CajaDetalles>
          {/* Tipo ROW */}
          {productMaster.datosTecnicos
            .filter((dato, index) => {
              if (dato.tipo == "row") {
                return dato;
              }
            })
            .map((dato, index) => {
              return (
                <CajitaDetalle key={index}>
                  <TituloDetalle>{dato.label}</TituloDetalle>
                  <DetalleTexto>{dato.detalles}</DetalleTexto>
                </CajitaDetalle>
              );
            })}
          {/* Tipo vertical */}
          {productMaster.datosTecnicos
            .filter((dato, index) => {
              if (dato.tipo == "vertical") {
                return dato;
              }
            })
            .map((dato, index) => {
              return (
                <CajitaDetalle className="vertical" key={index}>
                  <TituloDetalle className="vertical">
                    {dato.label}
                  </TituloDetalle>
                  <DetalleTexto className="vertical">
                    {dato.detalles}
                  </DetalleTexto>
                </CajitaDetalle>
              );
            })}
          {/* Tipo Dimensiones */}
          {productMaster.datosTecnicos
            .filter((dato, index) => {
              if (dato.tipo == "dimensiones") {
                return dato;
              }
            })
            .map((dato, index) => {
              return (
                <CajitaDetalle className="vertical" key={index}>
                  <TituloDetalle className="vertical">
                    {dato.label}
                  </TituloDetalle>
                  <CajaTablaRecuadro>
                    <TablaRecuadro>
                      <thead>
                        <FilaRecuadro className="cabeza">
                          {dato.headTable.map((head, index) => {
                            return (
                              <CeldaHeadRecuadro key={index}>
                                {head}
                              </CeldaHeadRecuadro>
                            );
                          })}
                        </FilaRecuadro>
                      </thead>
                      <tbody>
                        {dato.bodyTable.map((body, index) => {
                          return (
                            <FilaRecuadro className="body" key={index}>
                              <CeldaBodyRecuadro>{body.um} </CeldaBodyRecuadro>
                              <CeldaBodyRecuadro>
                                {body.ancho}
                              </CeldaBodyRecuadro>
                              <CeldaBodyRecuadro>
                                {body.largo}
                              </CeldaBodyRecuadro>
                              <CeldaBodyRecuadro>
                                {body.grosor}
                              </CeldaBodyRecuadro>
                            </FilaRecuadro>
                          );
                        })}
                      </tbody>
                    </TablaRecuadro>
                  </CajaTablaRecuadro>
                </CajitaDetalle>
              );
            })}
        </CajaDetalles>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const CajaDetalles = styled.div`
  /* width: 70%; */
  min-width: 70%;
  /* width: 70%; */
  max-width: 80%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid ${Tema.primary.grisNatural};
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.secondary.azulOpaco};
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};

  justify-content: space-between;
  &.vertical {
    flex-direction: column;
    border: none;
    width: 100%;
    background-color: ${Tema.secondary.azulSuave};
    padding: 4px;
    margin-bottom: 3px;
  }
`;
const TituloDetalle = styled.p`
  width: 49%;
  text-align: start;
  color: ${Tema.neutral.blancoHueso};

  &.vertical {
    width: 100%;
    text-align: start;
    text-decoration: underline;
    margin-bottom: 5px;
  }
`;

const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${Tema.neutral.blancoHueso};
  &.vertical {
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    padding-left: 15px;
    overflow: visible;
    white-space: wrap;
    height: auto;
  }
  &.lista {
    /* border: 1px solid red; */
    text-align: start;
    padding-left: 15px;
    width: 100%;
  }
`;
const CajaTablaRecuadro = styled.div`
  padding: 0 10px;
  overflow-x: scroll;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const TablaRecuadro = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;
const CeldaHeadRecuadro = styled.th`
  padding: 3px 7px;
  text-align: center;
  border: 1px solid ${Tema.secondary.azulOpaco};

  font-size: 0.9rem;
`;
const FilaRecuadro = styled.tr`
  width: 100%;
  color: ${Tema.neutral.blancoHueso};

  &.body {
    font-weight: normal;
    background-color: ${Tema.secondary.azulSuave};
  }

  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }

  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
`;
const CeldaBodyRecuadro = styled.td`
  font-size: 0.9rem;

  border: 1px solid ${Tema.secondary.azulOpaco};
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  text-align: center;
`;
const CajaBtn = styled.div``;
const InputSimple = styled(InputSimpleEditable)``;
const TextArea2 = styled(TextArea)``;
const WrapEdit = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const WranInterna = styled.div`
  width: 100%;
  border: 1px solid white;
  padding: 8px;
`;
