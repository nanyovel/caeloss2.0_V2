import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { ModalLoading } from "../../components/ModalLoading";
import { ClearTheme, Tema } from "../../config/theme";
import ImgInfo from "../../../public/img/informacion.png";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext.jsx";
import db from "../../firebase/firebaseConfig.js";
import { useDocByArrayCondition } from "../../libs/useDocByCondition.js";

export const TablaCiclo06ListoSAP = ({}) => {
  // // ************************** CODIGO LOADING ************************** //
  const [dbFurgonesEnSap, setDBFurgonesEnSap] = useState([]);
  const [dbBLsFleteSuelto, setDBBLsFleteSuelto] = useState([]);
  const [dbPartidasEnSap, setDBPartidasEnSap] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (dbFurgonesEnSap.length > 0) {
      setIsLoading(false);
    }
    if (dbFurgonesEnSap.length == 0) {
      setIsLoading(true);
    }
  }, [dbFurgonesEnSap]);

  //****************** CARGAR EL ESTADO GLOBAL (FURGONES ABIERTOS)*************** */
  // Calcular la fecha de hace 30 días
  const rangoDeTiempo = useMemo(() => {
    const hoy = new Date();
    const hace15Dias = new Date();
    hace15Dias.setDate(hoy.getDate() - 15);
    return Timestamp.fromDate(hace15Dias);
  }, []);
  // ****************** DOCUMENTOS CON ESCUCHADOR **********************
  const useDocByCondition = (
    collectionName,
    setState,
    campo,
    condicion,
    valor,
    campo2,
    condicion2,
    valor2
  ) => {
    const userAuth = useAuth().usuario;

    const [usuario, setUsuario] = useState(userAuth);
    useEffect(() => {
      // Este condicional es para que si el usuario ya descargo la base de datos pues que no vuelva a cargar, aunque el componente de desmonte y se vuelva a montar

      if (usuario) {
        console.log("DB 😐😐😐😐😐" + collectionName);
        let q;

        if (campo) {
          q = query(
            collection(db, collectionName),
            where(campo, condicion, valor),
            where(campo2, condicion2, valor2)
          );
        } else {
          q = query(collection(db, collectionName));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const coleccion = [];
          querySnapshot.forEach((doc) => {
            coleccion.push({ ...doc.data(), id: doc.id });
          });
          // console.log(coleccion);
          setState(coleccion);
          return coleccion;
        });

        // Limpieza de la escucha al desmontar
        return () => unsubscribe();
      }
    }, [
      collectionName,
      setState,
      campo,
      condicion,
      valor,
      campo2,
      condicion2,
      valor2,
      usuario,
    ]);
  };
  useDocByCondition(
    "furgones",
    setDBFurgonesEnSap,
    "status",
    "==",
    5,
    "fechaConclucionStamp",
    ">=",
    rangoDeTiempo
  );
  const condicionesPuerto = [
    {
      campo: "estadoDoc",
      condicion: "==",
      valor: 0,
    },
    {
      campo: "fleteSuelto.numeroDoc",
      condicion: "!=",
      valor: "",
    },
  ];
  useDocByArrayCondition(
    "billOfLading2",
    setDBBLsFleteSuelto,
    condicionesPuerto
  );

  useEffect(() => {
    if (dbBLsFleteSuelto.length > 0) {
      const partidasAux = dbBLsFleteSuelto.flatMap((bl) => {
        return bl.fleteSuelto.partidas;
      });
      const partidasSAP = partidasAux.filter((part) => part.status == 5);

      console.log(partidasSAP);
      setDBPartidasEnSap(partidasSAP);
    }
  }, [dbBLsFleteSuelto]);
  // // ******************** RECURSOS GENERALES ******************** //

  const habilitar = {
    search: true,
    // status:true,
    opcionesUnicas: true,
  };

  // // ******************** CONSOLIDACION ******************** //
  // Furgones en status dptoImport (CONSUMIBLE)
  const [initialValueFurgones, setInitialValueFurgones] = useState([]);
  const [listaFurgonesMaster, setListaFurgonesMaster] = useState([]);

  // Lista de material en status dptoImport
  const [initialValueMat, setInitialValueMat] = useState([]);
  const [listaMat, setListaMat] = useState([]);

  useEffect(() => {
    const furgonesAux = dbFurgonesEnSap;
    const partidasSapAux = dbPartidasEnSap.map((part) => {
      return {
        ...part,
        isCargaSuelta: true,
      };
    });
    const conglo = [...furgonesAux, ...partidasSapAux];
    setListaFurgonesMaster(conglo);
    setInitialValueFurgones(conglo);
  }, [dbFurgonesEnSap, dbPartidasEnSap]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entradaMaster = e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);

    if (e.target.name == "inputBuscar") {
      setListaFurgonesMaster(
        initialValueFurgones.filter((furgon) => {
          if (
            furgon.numeroDoc.toLowerCase().includes(entradaMaster) ||
            furgon.datosBL.proveedor.toLowerCase().includes(entradaMaster) ||
            furgon.datosBL.numeroBL.toLowerCase().includes(entradaMaster) ||
            furgon.datosBL.naviera.toLowerCase().includes(entradaMaster) ||
            furgon.datosBL.puerto.toLowerCase().includes(entradaMaster)
          ) {
            return furgon;
          }
        })
      );
    }

    if (e.target.value == "" && buscarDocInput == "") {
      setListaFurgonesMaster(initialValueFurgones);
      setListaMat(initialValueMat);
    }
  };

  const [hasAviso, setHasAviso] = useState(false);
  return (
    <>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Contenedores registrados en SAP, ultimos 30 dias.
          </TituloEncabezadoTabla>
          <CajaImgInfo onClick={() => setHasAviso(true)}>
            <ImgIconInfo src={ImgInfo} />
          </CajaImgInfo>
          {hasAviso ? (
            <ModalInfo
              setHasAviso={setHasAviso}
              titulo={"Listo en SAP"}
              texto={
                "Es la ultima fase del ciclo y ocurre cuando la mercancia queda registrada en nuestro ERP (SAP)."
              }
            ></ModalInfo>
          ) : null}
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          buscarDocInput={buscarDocInput}
        />
      </CabeceraListaAll>

      <>
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Numero*</CeldaHeadGroup>
                <CeldaHeadGroup>T</CeldaHeadGroup>
                <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                <CeldaHeadGroup>BL*</CeldaHeadGroup>
                <CeldaHeadGroup>Naviera</CeldaHeadGroup>
                <CeldaHeadGroup>Puerto</CeldaHeadGroup>
              </FilasGroup>
            </thead>
            <tbody>
              {listaFurgonesMaster.map((furgon, index) => {
                return (
                  <FilasGroup key={index} className="body">
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {furgon.isCargaSuelta ? (
                        <Enlaces
                          to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                          target="_blank"
                        >
                          {furgon.numeroDoc}
                        </Enlaces>
                      ) : (
                        <Enlaces
                          to={`/importaciones/maestros/contenedores/${encodeURIComponent(furgon.numeroDoc)}`}
                          target="_blank"
                        >
                          {furgon.numeroDoc}
                        </Enlaces>
                      )}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>{furgon.tamannio}</CeldasBodyGroup>

                    <CeldasBodyGroup
                      title={furgon.datosBL.proveedor}
                      className="proveedor"
                    >
                      {furgon.datosBL.proveedor}
                    </CeldasBodyGroup>

                    <CeldasBodyGroup>
                      <Enlaces
                        to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                        target="_blank"
                      >
                        {furgon.datosBL.numeroBL}
                      </Enlaces>
                    </CeldasBodyGroup>
                    <CeldasBodyGroup
                      className="naviera"
                      title={furgon.datosBL.naviera}
                    >
                      {furgon.datosBL.naviera}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup
                      className="puerto"
                      title={furgon.datosBL.puerto}
                    >
                      {furgon.datosBL.puerto}
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
          <br />
          <br />
          <br />
          <br />
        </CajaTablaGroup>
      </>
      {isLoading ? <ModalLoading /> : ""}
    </>
  );
};

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
  margin-top: 10px;
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${Tema.secondary.azulSuave};
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  color: ${Tema.secondary.azulOpaco};
  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty {
    width: 300px;
  }
  &.comentarios {
    max-width: 200px;
  }
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
  &.index {
    /* max-width: 5px; */
    /* background-color: red; */
  }

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  &.comentarios {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.status {
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EncabezadoTabla = styled.div`
  text-decoration: underline;
  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (max-width: 720px) {
    padding-left: 0;
  }
`;
const TituloEncabezadoTabla = styled.h2`
  color: black;
  font-size: 1.2rem;
  font-weight: normal;
  padding: 0 10px;
  @media screen and (max-width: 500px) {
    font-size: 16px;
  }
  @media screen and (max-width: 420px) {
    font-size: 14px;
  }

  &.descripcionEtapa {
    font-size: 0.9rem;
    margin: 0;
    padding: 0 15px;
    @media screen and (max-width: 480px) {
      font-size: 12px;
      /* border: 1px solid red; */
    }
  }
`;
const Resaltar = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;
const CajaImgInfo = styled.div`
  position: absolute;
  right: 0;
  /* top: -10px; */
  width: 35px;
  height: 35px;
  margin-left: 25px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ease all 0.2s;
  background-color: #818181;
  border-radius: 4px;
  &:hover {
    transform: scale(1.1);
    right: 5px;
    background-color: ${ClearTheme.complementary.warning};
    cursor: pointer;
  }
`;
const ImgIconInfo = styled.img`
  width: 25px;
`;
