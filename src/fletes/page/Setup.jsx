import { useEffect, useState } from "react";
import styled from "styled-components";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import db from "../../firebase/firebaseConfig.js";
import { Header } from "../../components/Header.jsx";
import { BtnNormal } from "../../components/BtnNormal.jsx";
import { ModalLoading } from "../../components/ModalLoading.jsx";
import { Alerta } from "../../components/Alerta.jsx";
import Footer from "../../components/Footer.jsx";

import { BotonQuery } from "../../components/BotonQuery.jsx";
import { obtenerDocPorId } from "../../libs/useDocByCondition.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Tema } from "../../config/theme.jsx";
import CajaNavegacion from "../../components/CajaNavegacion.jsx";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado.jsx";
import { parsearPath } from "../../libs/navegacionLib.js";

export const SetupFletes = ({
  // dbBillOfLading,
  // setDBBillOfLading,
  // dbOrdenes,
  // setDBOrdenes,
  dbUsuario,
  userMaster,
  setDBValoresUV,
  dbValoresUV,
}) => {
  const [dbObjetoInitialUV, setDBObjetoInitialUV] = useState({});
  obtenerDocPorId("miscelaneo", "detallesCamiones", setDBObjetoInitialUV);
  useEffect(() => {
    if (dbObjetoInitialUV?.array?.length > 0) {
      setDBValoresUV([...dbObjetoInitialUV.array]);
    }
  }, [dbObjetoInitialUV]);

  // Recursos generales
  const auth = getAuth();
  const usuario = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [valoresMaster, setValoresMaster] = useState([]);
  const [valoresEditables, setValoresEditables] = useState([]);

  useEffect(() => {
    document.title = "Caeloss - Fletes";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  // ************************** DAME UN GRUPO DE DOC POR CONDICION**************************
  const useDocByCondicion = (
    collectionName,
    setState,
    exp1,
    condicion,
    exp2
  ) => {
    useEffect(() => {
      if (usuario) {
        console.log("BASE de Datos 📄📄📄📄👨‍🏫👨‍🏫👨‍🏫📄📄👨‍🏫👨‍🏫");
        let q = "";

        if (exp1) {
          q = query(
            collection(db, collectionName),
            where(exp1, condicion, exp2)
          );
        } else {
          q = query(collection(db, collectionName));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const colecion = [];
          querySnapshot.forEach((doc) => {
            // console.log(doc.data())
            colecion.push({ ...doc.data(), id: doc.id });
          });
          setState(colecion);
        });
        // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
        return () => unsubscribe();
      }
    }, [collectionName, setState, exp1, condicion, exp2, usuario]);
  };

  useEffect(() => {
    const valoresOrdenados = dbValoresUV.sort((a, b) => a.no - b.no);
    console.log(dbValoresUV);

    setValoresEditables(
      valoresOrdenados.map((uv) => {
        return {
          ...uv,
          editando: false,
        };
      })
    );

    setValoresMaster(valoresOrdenados);
  }, [dbValoresUV]);

  // const cargarUnidades = () => {
  //   subirUnDocIdPropio(
  //     {
  //       array: dbValoresUV,
  //     },
  //     "miscelaneo",
  //     "detallesCamiones"
  //   );
  // };
  const navegacion = useNavigate();
  const editar = (e) => {
    let id = e.target.dataset.id;
    const hasPermiso = userMaster.permisos.includes("editConfigFlete");
    if (!hasPermiso) {
      navegacion("/", { replace: true });
    }

    setValoresEditables(
      valoresMaster.map((uv) => {
        return {
          ...uv,
          editando: uv.id == id,
        };
      })
    );
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    let index = Number(e.target.dataset.index);

    let valorParsed = value;
    let escribir = true;

    if (name != "descripcion") {
      let expReg = /^[\d.]{0,1000}$/;
      if (expReg.test(valorParsed) == false) {
        escribir = false;
        setMensajeAlerta(`Cantidad incorrecta.`);
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      } else {
        valorParsed = Number(value);
      }
    }

    if (name == "montoChofer" || name == "montoAyudante") {
      setValoresEditables(
        valoresEditables.map((vehiculo, i) => {
          if (index == i && escribir) {
            return {
              ...vehiculo,
              viajesInterno: {
                ...vehiculo.viajesInterno,
                [name]: valorParsed,
              },
            };
          } else {
            return vehiculo;
          }
        })
      );
    } else {
      setValoresEditables(
        valoresEditables.map((valor, i) => {
          if (index == i && escribir) {
            return {
              ...valor,
              [name]: valorParsed,
            };
          } else {
            return valor;
          }
        })
      );
    }
  };

  const cancelarEdicion = () => {
    setValoresEditables(
      valoresMaster.map((uv) => {
        return {
          ...uv,
          editando: false,
        };
      })
    );
  };

  const guardarEdicion = async (e) => {
    const hasPermiso = userMaster.permisos.includes("editConfigFlete");
    if (!hasPermiso) {
      navegacion("/", { replace: true });
    }

    setIsLoading(true);
    let id = e.target.dataset.id;
    let index = Number(e.target.dataset.index);
    const valorActualizar = doc(db, "miscelaneo", "detallesCamiones");
    // console.log(valoresEditables[index])
    // console.log(valoresEditables[index]);
    // console.log(valoresEditables);
    // setIsLoading(false);
    // return "";
    try {
      await updateDoc(valorActualizar, {
        ...dbObjetoInitialUV,
        array: valoresEditables,
      });

      setValoresMaster(
        valoresEditables.map((uv) => {
          return {
            ...uv,
            editando: false,
          };
        })
      );
      setValoresEditables(
        valoresEditables.map((uv) => {
          return {
            ...uv,
            editando: false,
          };
        })
      );

      setIsLoading(false);
      setMensajeAlerta("Valores actualizados correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.error("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }
  };
  const location = useLocation();
  const [datosFlete, setDatosFlete] = useState({});

  const [pageSelect, setPageSelect] = useState({});
  const pathModulo = "/fletes";
  const rutas = [
    {
      nombre: "Main",
      pathModulo: pathModulo,
      path: "",
      select: true,
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Setup",
      pathModulo: pathModulo,
      path: "/setup",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
  ];

  useEffect(() => {
    parsearPath(location, rutas, setPageSelect);
  }, [location]);
  return (
    <>
      <ContainerMaster>
        <ContainerSecciones>
          <Header titulo={"Calculadora Fletes"} subTitulo="Main" />
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq={"viewConfigFlete"}
          >
            <ContainerNav>
              <CajaNavegacion
                userMaster={userMaster}
                pageSelected={pageSelect}
                rutas={rutas}
              />
            </ContainerNav>
          </ElementoPrivilegiado>
        </ContainerSecciones>
        <ContainerSecciones className="contenido">
          {/* <BtnNormal onClick={() => cargarUnidades()}>Subir camiones</BtnNormal> */}
          <BotonQuery dbValoresUV={dbValoresUV} />
          <TituloFormula>Formulas - Calculo de costo</TituloFormula>
          <ContenedorFormula>
            <DetalleFormula className="titulo">
              Para mas de 30 kilometros:
            </DetalleFormula>
            <DetalleFormula>
              1-(Cantidad total de kilometros)-30KM de total radios
            </DetalleFormula>
            <DetalleFormula>2-Ese resultado + 25KM de horgura</DetalleFormula>
            <DetalleFormula>3-Ese resultado / 10</DetalleFormula>
            <DetalleFormula>
              4-Ese resultado se redondea hacia arriba o hacia abajo, segun
              corresponda
            </DetalleFormula>
            <DetalleFormula>
              . Ahora tenemos la cantidad de cuota, y cada cuota es igual a 10KM
            </DetalleFormula>
            <DetalleFormula>
              5-Ese resultado lo multiplicamos por el costo de la cuota del
              camion
            </DetalleFormula>
            <DetalleFormula>
              6-A ese resultado se le suma el costo del radio de 30KM de ese
              camion
            </DetalleFormula>
            <br />
            <DetalleFormula className="titulo">
              Para 30 kilometros o menos:
            </DetalleFormula>
            <DetalleFormula>
              Se coloca el monto fijo segun radio y unidad vehicular
            </DetalleFormula>
          </ContenedorFormula>

          <CajaTitulo>
            <TituloUnidad>Valores</TituloUnidad>
          </CajaTitulo>
          {valoresMaster.map((uv, index) => {
            return (
              <CajaUV key={index}>
                <CajitaFotoDetalles>
                  <CajaFoto>
                    <Img src={uv.urlFoto} />
                  </CajaFoto>
                  <CajaDetalles>
                    <CajitaTexto className="descripcion">
                      <TextoDetalle>Descripcion:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].descripcion}
                          name="descripcion"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>{uv.descripcion}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto className="descripcion">
                      <TextoDetalle>Incentivo chofer interno:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={
                            valoresEditables[index].viajesInterno.montoChofer
                          }
                          name="montoChofer"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>
                          {uv.viajesInterno.montoChofer}
                        </TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto className="descripcion">
                      <TextoDetalle>Incentivo ayudante interno:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={
                            valoresEditables[index].viajesInterno.montoAyudante
                          }
                          name="montoAyudante"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>
                          {uv.viajesInterno.montoAyudante}
                        </TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Cuota 10KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].cuota}
                          name="cuota"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.cuota}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 0 - 2KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio1_0a2}
                          name="radio1_0a2"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio1_0a2}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 2 - 4KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio2_2a4}
                          name="radio2_2a4"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio2_2a4}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 4 - 6KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio3_4a6}
                          name="radio3_4a6"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio3_4a6}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 6 - 9KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio4_6a9}
                          name="radio4_6a9"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio4_6a9}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 9 - 15KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio5_9a15}
                          name="radio5_9a15"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio5_9a15}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 15 - 20KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio6_15a20}
                          name="radio6_15a20"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio6_15a20}</TextoDetalle>
                      )}
                    </CajitaTexto>
                    <CajitaTexto>
                      <TextoDetalle>Radio 20 - 30KM:</TextoDetalle>
                      {valoresEditables[index].editando ? (
                        <InputEditable
                          type="text"
                          value={valoresEditables[index].radio7_20a30}
                          name="radio7_20a30"
                          data-index={index}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                      ) : (
                        <TextoDetalle>RD$ {uv.radio7_20a30}</TextoDetalle>
                      )}
                    </CajitaTexto>
                  </CajaDetalles>
                </CajitaFotoDetalles>
                <CajaBtn>
                  {valoresEditables[index].editando ? (
                    <>
                      <BtnEjecutar
                        data-id={uv.id}
                        data-index={index}
                        onClick={(e) => {
                          guardarEdicion(e);
                        }}
                      >
                        Guardar
                      </BtnEjecutar>
                      <BtnEjecutar
                        className="danger"
                        onClick={() => {
                          cancelarEdicion();
                        }}
                      >
                        Cancelar
                      </BtnEjecutar>
                    </>
                  ) : (
                    <>
                      <BtnEjecutar
                        data-id={uv.id}
                        onClick={(e) => {
                          editar(e);
                        }}
                      >
                        Editar
                      </BtnEjecutar>
                    </>
                  )}
                </CajaBtn>
              </CajaUV>
            );
          })}
        </ContainerSecciones>
        <ContainerSecciones className="footer">
          <Footer />
        </ContainerSecciones>
      </ContainerMaster>
      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};
const ContainerMaster = styled.div`
  position: relative;
  display: grid;
  min-height: 100%;
  grid-template-rows: auto 1fr auto;
`;
const ContainerSecciones = styled.div`
  &.contenido {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &.footer {
    width: 100%;
    height: 40px;
  }
`;

const Container = styled.div`
  margin-bottom: 25px;
`;
const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width: 1000px) {
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 410px) {
    width: 99%;
  }
`;
const ContenedorFormula = styled.div`
  width: 95%;
  margin: auto;
  border: 2px solid ${Tema.primary.grisNatural};
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 25px;
`;
const TituloFormula = styled.h2`
  color: ${Tema.primary.azulBrillante};
  text-align: center;
`;
const DetalleFormula = styled.p`
  color: ${Tema.secondary.azulOpaco};
  color: white;
  padding-left: 15px;
  &.titulo {
    padding-left: 0px;
    border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  }
`;

const CajaUV = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: auto;
  margin: auto;
  border: 2px solid ${Tema.primary.grisNatural};
  border-radius: 5px;
`;
const CajaTitulo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const TituloUnidad = styled.h2`
  text-align: center;
  color: ${Tema.primary.azulBrillante};
`;
const CajitaFotoDetalles = styled.div`
  /* border: 1px solid green; */
  display: flex;
  /* border: 2px solid red; */
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const CajaFoto = styled.div`
  width: 40%;
  /* border: 1px solid yellow; */
  padding: 10px;
  @media screen and (max-width: 900px) {
    margin: auto;
    width: 260px;
  }
`;
const Img = styled.img`
  width: 100%;
  /* border: 1px solid red; */
  margin: auto;
`;
const CajaDetalles = styled.div`
  width: 60%;
  padding: 15px;
  /* border: 1px solid blue; */
  @media screen and (max-width: 900px) {
    margin: auto;
    width: 100%;
  }
`;

const CajitaTexto = styled.div`
  width: 100%;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  /* border-radius: 4px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TextoDetalle = styled.p`
  color: ${Tema.secondary.azulOpaco};
  color: white;
  height: 25px;
  @media screen and (max-width: 450px) {
    height: auto;
    /* flex-direction:column ; */
    text-align: end;
  }
`;
const BtnEjecutar = styled(BtnNormal)`
  margin: auto;
  margin-bottom: 15px;
  margin-right: 5px;
`;
const CajaBtn = styled.div`
  margin: auto;
  /* border: 1px solid red; */
`;

const InputCelda = styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const InputEditable = styled(InputCelda)`
  height: 25px;
  width: 250px;
  border: 1px solid ${Tema.secondary.azulProfundo};
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 0;

  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
`;
