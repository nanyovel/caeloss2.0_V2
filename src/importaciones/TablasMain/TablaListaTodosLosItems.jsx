import { useEffect, useState } from "react";
import styled from "styled-components";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { ClearTheme, Tema } from "../../config/theme";

import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition";
import { BotonQuery } from "../../components/BotonQuery";
import ItemsEnviados from "./Items/ItemsEnviados";
import ItemsSinEnviar from "./Items/ItemsSinEnviar";
import MenuPestannias from "../../components/MenuPestannias";
import { useAuth } from "../../context/AuthContext";
import { ModalLoading } from "../../components/ModalLoading";

export const TablaListaTodosLosItems = ({
  setDBGlobalFurgones,
  dbGlobalFurgones,
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
}) => {
  // ******************** RECURSOS GENERALES ******************** //
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  const [isLoading, setIsLoading] = useState(false);

  // // ************************** CODIGO LOADING ************************** //
  useEffect(() => {
    if (dbGlobalFurgones.length > 0) {
      setIsLoading(false);
    }
    if (dbGlobalFurgones.length == 0) {
      setIsLoading(true);
    }
  }, [dbGlobalFurgones]);

  //****************** CARGAR EL ESTADO GLOBAL (FURGONES ABIERTOS)*************** */
  useEffect(() => {
    const traerData = async () => {
      const matFurgones = await fetchDocsByConditionGetDocs(
        "furgones",
        undefined,
        "status",
        "!=",
        5
      );

      setDBGlobalFurgones(matFurgones);
      const matCargaSuelta = await fetchDocsByConditionGetDocs(
        "billOfLading2",
        undefined,
        "estadoDoc",
        "==",
        0,
        "fleteSuelto.numeroDoc",
        "!=",
        ""
      );

      setBLCargaSuelta(matCargaSuelta);
    };

    // Esto para que la llamada a la base de datos se realice una sola vez
    if (dbGlobalFurgones.length == 0) {
      if (usuario) {
        traerData();
      }
    }
  }, []);

  // // ************************** COONSOLIDACION ************************** //
  const [initialValueMatBL, setInitialValueMatBL] = useState([]);
  const [materialesFurgones, setMaterialesFurgones] = useState([]);

  const [blCargaSuelta, setBLCargaSuelta] = useState([]);

  const [initialValueMatOC, setInitialValueMatOC] = useState([]);

  const [furgonesAbiertos, setFurgonesAbiertos] = useState([]);

  const [ordenesAbiertas, setOrdenesAbiertas] = useState([]);
  const [materialesOrdenes, setMaterialesOrdenes] = useState([]);

  // // ************************** PARSEAR DATOS ************************** //
  useEffect(() => {
    setFurgonesAbiertos(dbGlobalFurgones);
  }, [dbGlobalFurgones]);
  useEffect(() => {
    const itemsFlatMap = furgonesAbiertos.flatMap((furgon) => {
      return furgon.materiales.map((material) => ({
        ...material,
        furgon: furgon.numeroDoc,
        proveedor: furgon.datosBL.proveedor,
        status: furgon.status,
        fechas: {
          llegada05Concluido: furgon.fechas.llegada05Concluido,
        },
      }));
    });

    const partidasCargaSuelta = blCargaSuelta.flatMap((bl) => {
      return bl.fleteSuelto.partidas.map((part) => ({
        ...part,
      }));
    });
    console.log(partidasCargaSuelta);
    const matCargaSueltaParse = partidasCargaSuelta.flatMap((part) => {
      return part.materiales.map((mat) => ({
        ...mat,
        isCargaSuelta: true,
        datosBL: part.datosBL,
        part: part.numeroDoc,
        proveedor: part.datosBL.proveedor,
        status: part.status,
        fechas: {
          llegada05Concluido: part.fechas.llegada05Concluido,
        },
      }));
    });

    const matConExistencia = matCargaSueltaParse.filter((mat) => mat.qty > 0);

    console.log(matCargaSueltaParse);

    const congloMaterados = [...itemsFlatMap, ...matConExistencia];

    setMaterialesFurgones(congloMaterados);
    setInitialValueMatBL(congloMaterados);

    // Ordenes
    if (ordenesAbiertas.length > 0) {
      const materiales = ordenesAbiertas.flatMap((orden) => {
        return orden.materiales.map((material) => ({
          ...material,
          ordenCompra: orden.numeroDoc,
          proveedor: orden.proveedor,
          comentarioOrden: orden.comentarios,
          comentarios: material.comentarios || "",
        }));
      });
      setMaterialesOrdenes(materiales);
      setInitialValueMatOC(materiales);
    }
  }, [furgonesAbiertos, blCargaSuelta, ordenesAbiertas]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");
  const [statusDocInput, setStatusDocInput] = useState("");

  const handleSearch = (e) => {
    const ordenFind = ordenesAbiertas.find(
      (orden) => orden.numeroDoc == "20005339"
    );
    let shadowMatBL = [];
    let shadowMatOC = [];
    let entradaMaster = e.target.value.toLowerCase();
    let entradaSlave1 = "";

    if (e.target.name == "inputBuscar") {
      setBuscarDocInput(entradaMaster);
      entradaSlave1 = statusDocInput.toLowerCase();
    } else if (e.target.name == "cicloVida") {
      setStatusDocInput(entradaMaster);
      entradaSlave1 = buscarDocInput.toLowerCase();
    }

    if (arrayOpcionesPestannias[0].select == true) {
      if (e.target.name == "inputBuscar") {
        shadowMatBL = initialValueMatBL.filter((item) => {
          let numeroFurgonCarga = "";
          if (item.isCargaSuelta) {
            numeroFurgonCarga = item.part;
          } else {
            numeroFurgonCarga = item.furgon;
          }
          if (
            item.codigo.toLowerCase().includes(entradaMaster) ||
            item.descripcion.toLowerCase().includes(entradaMaster) ||
            item.qty.toString().includes(entradaMaster) ||
            numeroFurgonCarga.toLowerCase().includes(entradaMaster) ||
            item.proveedor.toLowerCase().includes(entradaMaster) ||
            item.ordenCompra.toLowerCase().includes(entradaMaster) ||
            item.comentarios.toLowerCase().includes(entradaMaster) ||
            item.comentarioOrden?.toLowerCase().includes(entradaMaster)
          ) {
            return item;
          }
        });

        if (statusDocInput != "") {
          shadowMatBL = shadowMatBL.filter((item) => {
            if (item.status == entradaSlave1) {
              return item;
            }
          });
        }
      }

      setMaterialesFurgones(shadowMatBL);
    } else if (arrayOpcionesPestannias[1].select == true) {
      if (e.target.name == "inputBuscar") {
        shadowMatOC = initialValueMatOC.filter((item) => {
          if (
            item.codigo.toLowerCase().includes(entradaMaster) ||
            item.descripcion.toLowerCase().includes(entradaMaster) ||
            item.proveedor.toLowerCase().includes(entradaMaster) ||
            item.ordenCompra.toLowerCase().includes(entradaMaster) ||
            item.comentarios.toLowerCase().includes(entradaMaster) ||
            item.comentarioOrden?.toLowerCase().includes(entradaMaster)
          ) {
            return item;
          }
        });
      }
      setMaterialesOrdenes(shadowMatOC);
    }
    if (e.target.value == "" && buscarDocInput == "" && statusDocInput == "") {
      setMaterialesFurgones(initialValueMatBL);
      setMaterialesOrdenes(initialValueMatOC);
    }
  };

  const [arrayOpcionesPestannias, setArrayOpcionesPestannias] = useState([
    {
      nombre: "Enviados",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Sin enviar",
      opcion: 1,
      select: false,
    },
  ]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpcionesPestannias((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
    setMaterialesFurgones(initialValueMatBL);
    setMaterialesOrdenes(initialValueMatOC);
    // setOrdenesAbiertas(initialValueMatOC);
    setBuscarDocInput("");
    setStatusDocInput("");
  };

  const [habilitar, setHabilitar] = useState({
    search: true,
    opcionesUnicas: false,
  });

  useEffect(() => {
    setHabilitar({
      ...habilitar,
    });
  }, [arrayOpcionesPestannias]);

  return (
    <>
      <BotonQuery
        materialesFurgones={materialesFurgones}
        materialesOrdenes={materialesOrdenes}
        ordenesAbiertas={ordenesAbiertas}
        dbGlobalFurgones={dbGlobalFurgones}
        furgonesAbiertos={furgonesAbiertos}
        initialValueMatOC={initialValueMatOC}
      />
      <MenuPestannias
        arrayOpciones={arrayOpcionesPestannias}
        handlePestannias={handleOpciones}
        ciclo={false}
      />
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            {arrayOpcionesPestannias[0].select
              ? "Items enviados hacia Rep. Dominicana"
              : arrayOpcionesPestannias[1].select
                ? "Items solicitados, aun sin enviar"
                : ""}
            .
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpcionesPestannias}
          buscarDocInput={buscarDocInput}
          tipo={"articulo"}
        />
      </CabeceraListaAll>
      {arrayOpcionesPestannias[0].select == true ? (
        <>
          <ItemsEnviados materiales={materialesFurgones} />
        </>
      ) : arrayOpcionesPestannias[1].select == true ? (
        <>
          <ItemsSinEnviar
            ordenesAbiertas={ordenesAbiertas}
            setOrdenesAbiertas={setOrdenesAbiertas}
            setMaterialesOrdenes={setMaterialesOrdenes}
            materialesOrdenes={materialesOrdenes}
            // Nuevas colecciones
            setDBGlobalOrdenes={setDBGlobalOrdenes}
            dbGlobalOrdenes={dbGlobalOrdenes}
          />
        </>
      ) : (
        ""
      )}
      {isLoading ? <ModalLoading /> : ""}
    </>
  );
};

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
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
  padding-left: 10px;
  &.subTitulo {
    color: ${ClearTheme.complementary.warning};
    font-size: 1rem;
    @media screen and (max-width: 460px) {
      font-size: 13px;
    }
  }
  @media screen and (max-width: 590px) {
    font-size: 16px;
  }
  @media screen and (max-width: 400px) {
    font-size: 14px;
  }
`;
