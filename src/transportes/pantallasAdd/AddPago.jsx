import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral";
import MenuPestannias from "../../components/MenuPestannias";
import { useEffect, useState } from "react";
import AddPago1Interno from "./Pagos/AddPago1Interno";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { BotonQuery } from "../../components/BotonQuery";
import { generarElementoPago } from "../libs/generarElementoReq";
import { ModalLoading } from "../../components/ModalLoading";
import { useNavigate } from "react-router-dom";

export default function AddPago({ userMaster }) {
  // ************************ RECURSOS GENERALES ************************
  const navigate = useNavigate();
  useEffect(() => {
    if (userMaster) {
      if (!userMaster.permisos.includes("accessAddPagosTMS")) {
        navigate("/transportes/");
      }
    }
  }, [userMaster]);
  const [arrayOpcionesPes, setArrayOpcionesPes] = useState([
    {
      nombre: "Internos",
      code: "interno",
      select: true,
    },
    {
      nombre: "Ext. Indep.",
      title: "Externo Independiente",
      code: "extIndependiente",
      select: false,
    },
    {
      nombre: "Ext. Empresas",
      title: "Externo Empresas",
      code: "externoEmpresas",
      select: false,
    },
    {
      nombre: "Otros",
      title: "Otros",
      code: "otros",
      select: false,
    },
  ]);
  const handlePestannias = (e) => {
    const code = e.target.dataset.code;
    setArrayOpcionesPes((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: opcion.code === code,
      }))
    );
  };

  // Trae todas las solicitados con sus pagos aprobados por finanzas
  // Trae todos los choferes activos
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  const [isLlamadaChofer, setIsLlamadaChofer] = useState(false);

  const useDocByCondition = (collectionName, tipo, setState) => {
    useEffect(() => {
      // Este condicional es para que si el usuario ya descargo la base de datos pues que no vuelva a cargar, aunque el componente de desmonte y se vuelva a montar
      let consulta;
      if (tipo == "solicitudes") {
        consulta = query(
          collection(db, collectionName),
          where("estadoDoc", "==", 3),
          where("contabilidad.allPaymentsMade", "==", false),
          where("contabilidad.log.logistica1.status", "==", 1),
          where("contabilidad.log.solicitante2.status", "==", 1),
          where("contabilidad.log.finanzas3.status", "==", 1)
        );
      } else if (tipo == "choferes") {
        consulta = query(
          collection(db, collectionName),
          where("estadoDoc", "!=", 3)
        );
        setIsLlamadaChofer(true);
      }

      if (usuario) {
        console.log("DB 😐😐😐😐😐" + collectionName);

        const unsubscribe = onSnapshot(consulta, (querySnapshot) => {
          const coleccion = [];
          querySnapshot.forEach((doc) => {
            coleccion.push({ ...doc.data(), id: doc.id });
          });
          setState(coleccion);
          return coleccion;
        });

        // Limpieza de la escucha al desmontar
        return () => unsubscribe();
      }
    }, [collectionName, tipo, setState, usuario]);
  };

  const [listaReq, setListaReq] = useState([]);
  const [listaChoferes, setListaChoferes] = useState([]);
  const [datosParsed, setDatosParsed] = useState(false);

  useDocByCondition("transferRequest", "solicitudes", setListaReq);
  useDocByCondition("choferes", "choferes", setListaChoferes);
  useEffect(() => {
    (async () => {
      // const dataRquest = await setListaReq(dataRquest);
      if (!isLlamadaChofer) {
        // const dataChoferes = await dataChoferes;
        setDatosParsed(true);
      }
    })();
  }, []);

  const [listaReqParsed, setListaReqParsed] = useState([]);
  const [listaChoferesParsed, setListaChoferesParsed] = useState([]);
  useEffect(() => {
    const listaReqParsedAux = listaReq.map((req) => {
      return {
        ...req,
        pagosAux: generarElementoPago(req),
      };
    });
    setListaReqParsed(listaReqParsedAux);
  }, [listaReq]);
  //

  // Agregar pagos a choferes
  useEffect(() => {
    const choferesParsedAux = listaChoferes.map((chofer) => {
      const pagosThisChofer = listaReqParsed
        .flatMap((req) => req.pagosAux)
        .filter((pago) => pago.beneficiario.id == chofer.id);

      // Ahora quita los pagos que ya hallan sido ejecutados
      const pagosSinEjecutar = pagosThisChofer.filter((pago) => {
        let pagoEjecutado = true;
        if (
          pago.codigoElementoOrigen === "ElOG1" ||
          pago.codigoElementoOrigen === "ElOG4"
        ) {
          pagoEjecutado = false;
          if (pago.detallesPago.camionExterno.pagoGenerado === true) {
            pagoEjecutado = true;
          }
          if (pago.detallesPago.choferInterno.pagoGenerado === true) {
            pagoEjecutado = true;
          }
        } else if (
          pago.codigoElementoOrigen === "ElOG2" ||
          pago.codigoElementoOrigen === "ElOG5"
        ) {
          if (pago.detallesPago.ayudanteInterno.pagoGenerado === false) {
            pagoEjecutado = false;
          }
        } else if (
          pago.codigoElementoOrigen === "ElOG3" ||
          pago.codigoElementoOrigen === "ElOG6"
        ) {
          if (pago.detallesPago.pagoGenerado === false) {
            pagoEjecutado = false;
          }
        } else {
          console.warn(
            "**CAELOSS** Codigo de elemento Origen desconociDo",
            pago.codigoElementoOrigen
          );
        }

        return !pagoEjecutado;
      });

      return {
        ...chofer,
        pagosAux: pagosSinEjecutar || [],
      };
    });
    setListaChoferesParsed(choferesParsedAux);
  }, [listaReqParsed, listaChoferes]);

  //
  //
  //
  const [datosMolde, setDatosModel] = useState(null);
  useEffect(() => {
    let datosMoldeAux = {
      choferTraer: 0,
    };
    const pestannia = arrayOpcionesPes.find((opcion) => opcion.select);
    if (pestannia.code == "interno") {
      datosMoldeAux = {
        ...datosMoldeAux,
        choferTraer: 0,
      };
    } else if (pestannia.code == "extIndependiente") {
      datosMoldeAux = {
        ...datosMoldeAux,
        choferTraer: 1,
      };
    } else if (pestannia.code == "externoEmpresas") {
      datosMoldeAux = {
        ...datosMoldeAux,
        choferTraer: 2,
      };
    } else if (pestannia.code == "otros") {
      datosMoldeAux = {
        ...datosMoldeAux,
        choferTraer: 3,
      };
    }
    setDatosModel({
      ...datosMoldeAux,
    });
  }, [arrayOpcionesPes]);

  return (
    userMaster && (
      <Container>
        <BotonQuery
          listaReqParsed={listaReqParsed}
          listaChoferesParsed={listaChoferesParsed}
        />
        <CajaMenuPes>
          <MenuPestannias
            arrayOpciones={arrayOpcionesPes}
            handlePestannias={handlePestannias}
          />
        </CajaMenuPes>
        {datosMolde && listaChoferesParsed.length > 0 && datosParsed && (
          <WraContenido>
            <ContainerControles>
              <TituloEncabezadoTabla>
                Generador de pagos por chofer
              </TituloEncabezadoTabla>
              <WrapFunciones>
                <ContenedorInputs>
                  <TituloBuscar>Buscar</TituloBuscar>
                  <InputSencillo />
                </ContenedorInputs>
              </WrapFunciones>
            </ContainerControles>
            {
              <AddPago1Interno
                listaReqParsed={listaReqParsed}
                datosMolde={datosMolde}
                listaChoferesParsed={listaChoferesParsed}
                userMaster={userMaster}
              />
            }
          </WraContenido>
        )}
        {!datosParsed && <ModalLoading />}
      </Container>
    )
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;
const WraContenido = styled.div`
  width: 100%;
`;
const ContainerControles = styled.div`
  background-color: ${Theme.secondary.azulProfundo};
  width: 100%;
  padding: 5px;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
  background-color: ${ClearTheme.primary.azulBrillante};
  border-top: 1px solid white;
  border-bottom: 1px solid white;
`;
const TituloEncabezadoTabla = styled.h2`
  font-size: 1.1rem;
  font-weight: normal;
  color: black;
  text-decoration: underline;
`;
const WrapFunciones = styled.div`
  display: flex;
`;

const ContenedorInputs = styled.div`
  background-color: ${Tema.secondary.azulOscuro2};
  background-color: inherit;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  /* height: 40px; */
  &.btns {
    display: flex;
    align-items: end;
    justify-content: end;
    flex-direction: row;
  }
`;

const TituloBuscar = styled.h2`
  color: white;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

  color: ${Tema.secondary.azulOpaco};
  color: white;
  font-weight: 400;
`;
const InputSencillo = styled(InputSimpleEditable)`
  height: 25px;
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
const CajaMenuPes = styled.div`
  margin-bottom: 8px;
`;
