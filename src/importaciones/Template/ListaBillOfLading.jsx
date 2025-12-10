import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { DetalleBL } from "../view/DetalleBL";
import { calcDiasRestante, funcionDiasRestantes } from "../components/libs";
import {
  fetchDocEscuhadorSinEffect,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import { useAuth } from "../../context/AuthContext";
import { BotonQuery } from "../../components/BotonQuery";

export const ListaBillOfLading = ({ dbOrdenes, setDBOrdenes, userMaster }) => {
  //********************* CARGAR EL ESTADO GLOBAL (BILL OF LADING ABIERTOS)************************** */
  const parametro = useParams();
  const docUser = parametro.id;
  const [bLDB, setDB] = useState([]);
  const listaDocs = useDocByCondition(
    "billOfLading2",
    setDB,
    "numeroDoc",
    "==",
    docUser
  );

  // // ******************** PARSEAR DOC MASTER ******************** //
  const [blMaster, setBLMaster] = useState(null);
  const [furgonesMaster, setFurgonesMaster] = useState([]);
  // 0-Sin ejecutar
  // 1-Encontrado
  // 2-NO encontrado
  const [docEncontrado, setDocEncontrado] = useState(0);

  useEffect(() => {
    if (bLDB.length > 0) {
      const billDB = bLDB[0];
      const diasRestantes = calcDiasRestante(
        billDB.llegada02AlPais.fecha,
        billDB?.diasLibres
      );
      const blAux = {
        ...billDB,
        diasRestantes: diasRestantes,
        valoresAux: {
          ...(billDB.valoresAux || {}),
        },
      };
      setBLMaster(blAux);
      setDocEncontrado(1);
    }
  }, [bLDB]);

  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  const [furgonesDB, setFurgonesDB] = useState([]);
  useEffect(() => {
    if (usuario && blMaster) {
      const unsubscribe = fetchDocEscuhadorSinEffect(
        "furgones",
        setFurgonesDB,
        "datosBL.numeroBL",
        "==",
        blMaster.numeroDoc,
        undefined
      );

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe(); // ← Cancelamos el escuchador
        }
      };
    }
  }, [blMaster]);

  useEffect(() => {
    setFurgonesMaster(furgonesDB);
  }, [furgonesDB]);
  return (
    <>
      <Contenedor>
        {blMaster && (
          <DetalleBL
            blMaster={blMaster}
            docEncontrado={docEncontrado}
            setDocEncontrado={setDocEncontrado}
            userMaster={userMaster}
            furgonesMaster={furgonesMaster}
          />
        )}
      </Contenedor>
    </>
  );
};

const Contenedor = styled.div`
  height: 97%;
  padding: 1px;
  /* border: 2px solid #fa2014; */
  margin-bottom: 100px;
`;
