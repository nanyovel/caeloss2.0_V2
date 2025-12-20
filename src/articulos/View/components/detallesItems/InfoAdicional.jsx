import { useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../../../config/theme";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../../components/InputGeneral";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import { infoAdicionSchema } from "../../../schemas/productoSchema";
import { Alerta } from "../../../../components/Alerta";

export default function InfoAdicional({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const handleInputs = (e) => {
    const dataIndex = e.target.dataset.index;
    const { value, name } = e.target;

    let infoAdicionalUp = productEditable.infoAdicional;
    if (name == "titulo") {
      infoAdicionalUp = productEditable.infoAdicional.map((info, index) => {
        if (index == dataIndex) {
          return {
            ...info,
            titulo: value,
          };
        }
        return {
          ...info,
        };
      });
    } else if (name == "parrafo") {
      const indexDataset = e.target.dataset.indexparrafo;
      infoAdicionalUp = productEditable.infoAdicional.map((info, index) => {
        console.log(dataIndex);
        console.log(indexDataset);
        if (index == dataIndex) {
          return {
            ...info,
            parrafos: info.parrafos.map((parrafo, index) => {
              if (indexDataset == index) {
                return value;
              } else {
                return parrafo;
              }
            }),
          };
        }
        return {
          ...info,
        };
      });
    }
    setProductoEditable({
      ...productEditable,
      infoAdicional: infoAdicionalUp,
    });
  };
  const addParrafo = (e, tipo) => {
    const dataIndex = e.target.dataset.index;
    if (tipo == "parrafo") {
      setProductoEditable({
        ...productEditable,
        infoAdicional: productEditable.infoAdicional.map((info, index) => {
          if (index == dataIndex) {
            return {
              ...info,
              parrafos: [...info.parrafos, ""],
            };
          } else {
            return info;
          }
        }),
      });
    } else if (tipo == "infoGeneral") {
      setProductoEditable({
        ...productEditable,
        infoAdicional: [...productEditable.infoAdicional, infoAdicionSchema],
      });
    }
  };
  const removeParrafo = (e, tipo) => {
    const dataIndex = e.target.dataset.index;
    if (tipo == "parrafo") {
      setProductoEditable({
        ...productEditable,
        infoAdicional: productEditable.infoAdicional.map((info, index) => {
          if (index == dataIndex) {
            if (info.parrafos.length == 1) {
              return {
                ...info,
                parrafos: info.parrafos,
              };
            }
            return {
              ...info,
              parrafos: info.parrafos.slice(0, -1),
            };
          } else {
            return info;
          }
        }),
      });
    } else if (tipo == "infoGeneral") {
      setProductoEditable({
        ...productEditable,
        infoAdicional: productEditable.infoAdicional.slice(0, -1),
      });
    }
  };
  return (
    <Container>
      {modoEditar ? (
        <>
          <WrapInput>
            {productEditable.infoAdicional.map((info, index) => {
              return (
                <WrapInter key={index}>
                  <CajaDatosAdicional key={index}>
                    <InputSimple
                      data-index={index}
                      onChange={(e) => handleInputs(e)}
                      value={info.titulo}
                      name="titulo"
                    />
                    {info.parrafos.map((p, i) => {
                      return (
                        <TextArea2
                          key={i}
                          name="parrafo"
                          data-index={index}
                          data-indexparrafo={i}
                          value={p}
                          onChange={(e) => handleInputs(e)}
                        />
                      );
                    })}
                  </CajaDatosAdicional>
                  <CajaBtn className="parrafo">
                    <BtnSimple
                      data-index={index}
                      className={`parrafo
                        ${info.parrafos.length == 1 && "parrafoDisabled"}
                        
                        `}
                      onClick={(e) => removeParrafo(e, "parrafo")}
                    >
                      -
                    </BtnSimple>
                    <BtnSimple
                      data-index={index}
                      className="parrafo"
                      onClick={(e) => addParrafo(e, "parrafo")}
                    >
                      +
                    </BtnSimple>
                  </CajaBtn>
                </WrapInter>
              );
            })}
          </WrapInput>
          <br />
          <br />
          <hr />
          <hr />
          <CajaBtn>
            <BtnGeneralButton onClick={(e) => removeParrafo(e, "infoGeneral")}>
              -
            </BtnGeneralButton>
            <BtnGeneralButton onClick={(e) => addParrafo(e, "infoGeneral")}>
              +
            </BtnGeneralButton>
          </CajaBtn>
        </>
      ) : (
        productMaster.infoAdicional.map((info, index) => {
          return (
            <CajaDatosAdicional key={index}>
              <Subtitulo>{info.titulo}</Subtitulo>
              {info.parrafos.map((p, i) => {
                return <Parrafo key={i}>{p}</Parrafo>;
              })}
            </CajaDatosAdicional>
          );
        })
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
}
const Container = styled.div`
  min-height: 40px;
  /* padding: 0 25px; */
`;

const Parrafo = styled.p`
  color: ${Tema.neutral.blancoHueso};
  color: ${ClearTheme.neutral.blancoCalido};
  font-size: 1.2rem;
  margin-bottom: 15px;
`;
const Titulo = styled.h2`
  /* text-decoration: underline; */
  color: ${Tema.neutral.blancoHueso};
  border-bottom: 2px solid;
`;
const Subtitulo = styled.h3`
  color: ${Tema.neutral.blancoHueso};
  color: ${ClearTheme.neutral.blancoCalido};
  text-decoration: underline;
`;
const CajaDatosAdicional = styled.div`
  padding-left: 15px;
`;
const TextArea2 = styled(TextArea)``;
const InputSimple = styled(InputSimpleEditable)``;
const CajaBtn = styled.div`
  &.parrafo {
    /* border: 1px solid red; */
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  &.parrafo {
    width: 30px;
    max-width: 50px;
    min-width: auto;
    /* margin: 40px; */
    margin: 2px;
    background-color: #1a74c4;
    &:hover {
      background-color: white;
    }
  }

  &.parrafoDisabled {
    background-color: ${ClearTheme.primary.grisCielos};
    cursor: default;
    &:hover {
      background-color: ${ClearTheme.primary.grisCielos};
      color: white;
    }
  }
`;
const WrapInput = styled.div`
  border: 1px solid white;
  padding: 4px;
  box-shadow: ${Theme.config.sombra};
  border-radius: 6px;
`;
const WrapInter = styled.div`
  border: 1px solid white;
`;
