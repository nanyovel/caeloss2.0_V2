import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InputSimpleEditable } from "../components/InputGeneral";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import { fetchGetDocs } from "../libs/useDocByCondition";
import { actualizarUnaPropiedad } from "../libs/FirebaseLibs";

export default function ActualizarDoc() {
  const [idDoc, setIdDoc] = useState("");
  const [coleccionProducto, setColeccionProduct] = useState("");
  const actualizarDoc = async () => {
    if (!idDoc || !coleccionProducto) {
      console.log("colocar id");
      return;
    }

    try {
      const docActualizar = doc(db, coleccionProducto, idDoc);
      updateDoc(docActualizar, {
        tipo: 1,
      });

      console.log("actualizado!!!✅");
    } catch (error) {
      console.log(error);
    }
  };
  //
  //
  //
  //
  // ***************** Actualizar una coleccion *****************
  const [productos, setProductos] = useState([]);
  fetchGetDocs("productos", setProductos);
  const [coleccionColec, setColeccionColec] = useState("");
  const [propiedadAfectar, setPropiedadAfectar] = useState("");
  const actualizarColeccion = async () => {
    return;
    if (!coleccionColec) {
      console.log("colocar coleccion");
      return;
    }

    const actualizador = {
      nombreColeccion: "productos",
      dataMaster: productos,
      propiedadAfectar: propiedadAfectar,
      nuevoValor: [],
    };
    actualizarUnaPropiedad(actualizador);
  };

  return (
    <Container>
      <Titulo>Actualizar un documento</Titulo>
      <p>Id documento:</p>
      <InputSimple value={idDoc} onChange={(e) => setIdDoc(e.target.value)} />
      <p>Coleccion:</p>
      <InputSimple
        value={coleccionProducto}
        onChange={(e) => setColeccionProduct(e.target.value)}
      />
      {/* <BtnSimple onClick={() => actualizarDoc()}>Aceptar</BtnSimple> */}
      <br />
      <br />
      <Titulo>Actualizar una coleccion</Titulo>
      <p>Coleccion:</p>
      <InputSimple
        value={coleccionColec}
        onChange={(e) => setColeccionColec(e.target.value)}
      />
      <p>Prodiedad afectar:</p>
      <InputSimple
        value={propiedadAfectar}
        onChange={(e) => setPropiedadAfectar(e.target.value)}
      />
      {/* <BtnSimple onClick={() => actualizarColeccion()}>Up coleccion</BtnSimple> */}
    </Container>
  );
}
const Container = styled.div`
  border: 2px solid green;
  background-color: #307a13;
`;
const InputSimple = styled(InputSimpleEditable)``;
const BtnSimple = styled(BtnGeneralButton)``;
const Titulo = styled.h2``;
