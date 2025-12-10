import { useEffect, useState } from "react";
import styled from "styled-components";

import { AddBL } from "../CreateDB/AddBL";
import { AddOC } from "../CreateDB/AddOC";
import { OpcionUnica } from "../../components/OpcionUnica";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

export const Add = ({ setOpcionUnicaSelect, userMaster }) => {
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes, setDBOrdenes] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const usuario = auth.currentUser;
  let location = useLocation();
  let lugar = location.pathname;

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
        q = query(collection(db, collectionName), where(exp1, condicion, exp2));

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
    }, [collectionName, setState, exp1, condicion, exp2]);
  };

  // useDocByCondicion("ordenesCompra", setDBOrdenes, "estadoDoc", "<", 2);
  // useDocByCondicion("billOfLading", setDBBillOfLading, "estadoDoc", "<", 2);

  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  useEffect(() => {
    if (dbBillOfLading.length > 0) {
      console.log(dbBillOfLading);
    }
  }, [dbBillOfLading]);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Bill of Lading",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Orden de compra",
      opcion: 1,
      select: false,
    },
  ]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Pantallas"
        name="grupoA"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );
  }, [OpcionUnica, arrayOpciones]);

  return (
    <>
      {/* <Header titulo="Sistema gestion de importaciones" subTitulo="Agregar" /> */}
      <Container>
        {/* <ContainerNav>
          <CajaNavegacion
            pageSelected={4}
            dbUsuario={dbUsuario}
            userMaster={userMaster}
          />
          <OpcionUnica
            titulo="Pantallas"
            name="grupoA"
            arrayOpciones={arrayOpciones}
            handleOpciones={handleOpciones}
          />
        </ContainerNav> */}

        {arrayOpciones[0].select == true ? (
          <AddBL
            dbBillOfLading={dbBillOfLading}
            setDBBillOfLading={setDBBillOfLading}
            userMaster={userMaster}
          />
        ) : arrayOpciones[1].select == true ? (
          <AddOC
            dbOrdenes={dbOrdenes}
            setDBOrdenes={setDBOrdenes}
            userMaster={userMaster}
          />
        ) : (
          ""
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  margin-bottom: 100px;
`;
