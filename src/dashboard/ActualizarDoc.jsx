import React, { useState } from "react";
import styled from "styled-components";
import { InputSimpleEditable } from "../components/InputGeneral";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import e from "cors";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

export default function ActualizarDoc() {
  const [idDoc, setIdDoc] = useState("");
  const [coleccionDB, setColeccionDB] = useState("");
  const actualizarDoc = async () => {
    if (!idDoc || !coleccionDB) {
      console.log("colocar id");
      return;
    }

    try {
      const docActualizar = doc(db, coleccionDB, idDoc);
      updateDoc(docActualizar, {
        tipo: 1,
      });

      console.log("actualizado!!!✅");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <p>Id documento:</p>
      <InputSimple value={idDoc} onChange={(e) => setIdDoc(e.target.value)} />
      <p>Coleccion:</p>
      <InputSimple
        value={coleccionDB}
        onChange={(e) => setColeccionDB(e.target.value)}
      />
      <BtnSimple onClick={() => actualizarDoc()}>Aceptar</BtnSimple>
    </Container>
  );
}
const Container = styled.div`
  border: 2px solid green;
  background-color: #307a13;
`;
const InputSimple = styled(InputSimpleEditable)``;
const BtnSimple = styled(BtnGeneralButton)``;
