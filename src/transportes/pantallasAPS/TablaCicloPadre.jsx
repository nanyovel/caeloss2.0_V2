import { useEffect, useState } from "react";
import styled from "styled-components";
import MenuPestannias from "../../components/MenuPestannias";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import db from "../../firebase/firebaseConfig";
import TablaCicloHijo from "./TablaCicloHijo";
import { BotonQuery } from "../../components/BotonQuery";

export default function TablaCicloPadre({
  userMaster,
  arrayOpciones,
  handlePestannias,
  quitarPagosVehAddSinConcluir,
  columnasExcel,
  valoresMoldePadre,

  dbLlamadas,
  setDBLLamadas,
}) {
  // ********************* IMPRIMIENDO TABLAS EN PANTALLA *******************
  const [datosMolde, setDatosMolde] = useState(null);
  const [masterDB, setMasterDB] = useState([]);
  useEffect(() => {
    let datosMoldeAux = {
      valoresMoldePadre: valoresMoldePadre,
      titulo: "Pagos sin procesar ",
      numLlamada: 0,
      rechazada: false,
      combinacionStatusTraer: {
        statusLogistica: 0,
        statusSolicitante: 0,
        statusContabilidad: 0,
      },
      tipoChofer: valoresMoldePadre.tipoChofer, // 0-interno , 1-ext ind, 2-ext emp

      permisoAprobacion: "approvedPagosLogisticaTMS",
      campoLogUpdate: "logistica1",
      textoSinDatos: "~ No existen pagos sin procesar. ~",
    };
    const opcionSeleccionada = arrayOpciones.find((opcion) => opcion.select);

    if (opcionSeleccionada.code == "sinProcesar") {
      //  NO TENEMOS QUE CONFIGURAR NADA PORQUE POR DEFECTO TRAE ESTA CONFIGURACION
    }
    if (opcionSeleccionada.code == "aprobadoPorLogistica") {
      datosMoldeAux = {
        ...datosMoldeAux,
        titulo: "Pagos aprobados por logistica",
        numLlamada: 1,
        combinacionStatusTraer: {
          ...datosMoldeAux.combinacionStatusTraer,
          statusLogistica: 1,
          statusSolicitante: 0,
          statusContabilidad: 0,
        },
        permisoAprobacion: "approvedPagosSolicitanteTMS",
        campoLogUpdate: "solicitante2",
        textoSinDatos: "~ No existen pagos aprobados por logistica. ~",
      };
    }
    if (opcionSeleccionada.code == "aprovadoPorSolicitante") {
      datosMoldeAux = {
        ...datosMoldeAux,
        titulo: "Pagos aprobados por solicitante",
        numLlamada: 2,
        combinacionStatusTraer: {
          ...datosMoldeAux.combinacionStatusTraer,
          statusLogistica: 1,
          statusSolicitante: 1,
          statusContabilidad: 0,
        },

        permisoAprobacion: "approvedPagosFinanzasTMS",
        campoLogUpdate: "finanzas3",
        textoSinDatos: "~ No existen pagos aprobados por solicitante. ~",
      };
    }
    if (opcionSeleccionada.code == "aprovadorPorFinanzas") {
      datosMoldeAux = {
        ...datosMoldeAux,
        titulo: "Pagos aprobados por finanzas",
        numLlamada: 3,
        combinacionStatusTraer: {
          ...datosMoldeAux.combinacionStatusTraer,
          statusLogistica: 1,
          statusSolicitante: 1,
          statusContabilidad: 1,
        },

        permisoAprobacion: "exportsFinzasRechzTMS",
        campoLogUpdate: null,
        textoSinDatos: "~ No existen pagos aprobados por finanzas. ~",
      };
    }
    if (opcionSeleccionada.code == "rechazado") {
      datosMoldeAux = {
        ...datosMoldeAux,
        titulo: "Pagos rechazados",
        numLlamada: 4,
        rechazada: true,
        combinacionStatusTraer: {
          ...datosMoldeAux.combinacionStatusTraer,
          // Aqui coloque todas en cancelada pero la verdad es que la intencion es que cualquiera que este cancelada, esto se usa como datos base
          statusLogistica: 2,
          statusSolicitante: 2,
          statusContabilidad: 2,
        },
        permisoAprobacion: "exportsFinzasRechzTMS",
        campoLogUpdate: null,
        textoSinDatos: "~ No existen pagos rechazados. ~",
      };
    }
    setDatosMolde(datosMoldeAux);

    fetchGetDocs("transferRequest", datosMoldeAux);
  }, [userMaster, arrayOpciones, valoresMoldePadre]);

  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  const [sinDatos, setSinDatos] = useState(false);

  const fetchGetDocs = async (collectionName, datosMolde) => {
    if (
      usuario &&
      dbLlamadas[datosMolde.valoresMoldePadre.tipoChofer][datosMolde.numLlamada]
        .isLLamada == false &&
      datosMolde
    ) {
      console.log(
        "1111111111111111111111111111111111111111111111111111111111111111"
      );
      const condicionesBase = [
        where("estadoDoc", "==", 3),
        where("contabilidad.allPaymentsMade", "==", false),
      ];
      //
      //
      //DEFINIR LLAMADA POR PANTALLA / TIPO CHOFER
      // Aqui dice:
      // 1-Si estamos en una pantalla homogenea es decir:
      // 0-Interno / 1-Ext Ind / 2-Ext Inde
      // Entonces traeme las solicitudes que el chofer master sea de ese tipo,
      // ⚠️OJO:Esto traera solicitudes con choferes adicionales incluyendo choferes de otro tipo, esto mas adelante lo filtramos en el componente hijo, dado a que sera una minoria

      // 2-Pero si estamos en la pantalla mixto, la unica condicion es que tenga vehiculos adicionales, dado que para que sea mixto debe haber varios vehiculos
      // ⚠️OJO: Esto trarea solicitudes que sus choferes adicionales sean del mismo tipo que el chofer master, por tanto esa solicitud no es mixto, esto lo filtramos en el componente hijo

      const pantallaHomogenea = [
        where("datosEntrega.chofer.tipo", "==", datosMolde.tipoChofer),
      ];
      const pantallaHeterogeneo = [
        where("datosFlete.vehiculosAdicionalesTiene", "==", true),
      ];
      const isMixta = datosMolde.valoresMoldePadre.mixta;
      //
      //
      //
      //
      const condicionesRechazo = [where("contabilidad.rechazada", "==", true)];

      const condicionesAprobadas = [
        where(
          "contabilidad.log.logistica1.status",
          "==",
          datosMolde.combinacionStatusTraer.statusLogistica
        ),
        where(
          "contabilidad.log.solicitante2.status",
          "==",
          datosMolde.combinacionStatusTraer.statusSolicitante
        ),
        where(
          "contabilidad.log.finanzas3.status",
          "==",
          datosMolde.combinacionStatusTraer.statusContabilidad
        ),
      ];

      // Construir la query
      const q = query(
        collection(db, collectionName),
        ...condicionesBase,
        ...(isMixta ? pantallaHeterogeneo : pantallaHomogenea),
        ...(datosMolde.rechazada ? condicionesRechazo : condicionesAprobadas)
      );

      console.log("DB 😐😐😐😐😐" + collectionName);

      (async () => {
        try {
          const consultaDB = await getDocs(q);

          const coleccion = consultaDB.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Verifica si algun vehiculo adicional no esta concluido
          // Esto realmente no deberia pasar, pues una solicitud no se permite concluir mientras tenga choferes sin concluir
          const coleccionSoloConcluidoAdd =
            quitarPagosVehAddSinConcluir(coleccion);

          // Ahora quita las solicitudes que ya existan localmente, esto ocurre cuando aprovamos o rechazamos una solicitud y luego pasamos a una pantalla que aun no hallamos cliqueado, el sistema traera todo, pero esa que actualizamos localmente tambien aparecera en esa X pantalla
          const coleccionFltro2 = coleccionSoloConcluidoAdd.filter((req) => {
            const idOrdenesLocal = masterDB.map((orden) => orden.id);
            const hasOrden = idOrdenesLocal.includes(req.id);
            if (!hasOrden) {
              return {
                ...req,
              };
            }
          });
          // console.log(coleccion);
          // console.log(coleccionSoloConcluidoAdd);
          // console.log(coleccionFltro2);
          setMasterDB([...masterDB, ...coleccionFltro2]);

          //
          setDBLLamadas(
            dbLlamadas.map((call, index) => {
              return call.map((llam, i) => {
                if (
                  datosMolde.numLlamada == i &&
                  datosMolde.valoresMoldePadre.tipoChofer == index
                ) {
                  return {
                    ...llam,
                    isLLamada: true,
                  };
                } else {
                  return { ...llam };
                }
              });
            })
          );
        } catch (error) {
          console.log(error);
        }
      })();
    }
  };
  return (
    <Container>
      <MenuPestannias
        handlePestannias={handlePestannias}
        arrayOpciones={arrayOpciones}
        ciclo={true}
      />
      {datosMolde && (
        <TablaCicloHijo
          userMaster={userMaster}
          datosMolde={datosMolde}
          sinDatos={sinDatos}
          masterDB={masterDB}
          setMasterDB={setMasterDB}
          arrayOpciones={arrayOpciones}
          columnasExcel={columnasExcel}
          valoresMoldePadre={valoresMoldePadre}
          setSinDatos={setSinDatos}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;
