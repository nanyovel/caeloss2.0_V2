import React, { useEffect, useState } from "react";
import TablaResultadoConjunto from "../../../components/TablaResultadoConjunto";
import {
  fetchDocsByArrayContains,
  fetchDocsByIn,
  fetchGetDocs,
  useDocByCondition,
} from "../../../../libs/useDocByCondition";

export default function ListaConjuntos({ docUser }) {
  const [conjuntosDB, setConjuntosDB] = useState([]);

  useEffect(() => {
    // console.log(conjuntosDB);
    (async () => {
      const data = await fetchDocsByArrayContains(
        "conjuntos",
        setConjuntosDB,
        "categorias",
        docUser
      );
      setConjuntosDB(data);
      console.log(data);
    })();
  }, [docUser]);
  return <TablaResultadoConjunto datos={conjuntosDB} />;
}
