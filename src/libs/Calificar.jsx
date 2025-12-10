import styled from "styled-components";
import ImgEstrella from "../../public/img/estrella.png";
import ImgEstrellaVacia from "../../public/img/estrellaEnNegro.png";
import db from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Alerta } from "../components/Alerta";
import { useEffect, useState } from "react";
import { BotonQuery } from "../components/BotonQuery";
import { ES6AFormat } from "./FechaFormat";
import { ClearTheme, Tema, Theme } from "../config/theme";

export default function calificar({
  qtyEstrella,
  tipo,
  documento,
  propiedadAfectar,
  editable,
}) {
  // *************** CONFIG GENqtyERAL *******************

  let i = 0;
  const [arrayState, setArrayState] = useState([]);
  const textoMostrar = [
    "Muy Malo 😡",
    "Malo 😠",
    "Regular 😐",
    "Bueno 🙂",
    "Muy Bueno 😃",
  ];
  const [showText, setShowText] = useState("");
  const [calificacionMaster, setCalificacionMaster] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  // Definir cantidad de estrellas
  useEffect(() => {
    // textoMostrar[numStar];
    actualizarCalificacion(qtyEstrella);
    setShowText(textoMostrar[qtyEstrella - 1]);
  }, [editable, qtyEstrella]);
  // Alimentar array imprimir
  const actualizarCalificacion = (calificacion) => {
    setCalificacionMaster(
      calificacionMaster.map((star, index) => {
        if (index < calificacion) {
          return true;
        } else {
          return false;
        }
      })
    );
  };
  useEffect(() => {
    const nuevoArray = [];
    for (let i = 0; i < 5; i++) {
      nuevoArray.push(
        <CajaEstrellaDoble
          key={i}
          onMouseEnter={(e) => entrarRaton(e)}
          onMouseLeave={(e) => salirMouser(e)}
          data-index={i + 1}
        >
          <FotoEstrella
            src={ImgEstrellaVacia}
            // key={i}
            className={`${editable ? " editable " : ""}${tipo}`}
            data-index={i + 1}
            onClick={(e) => atualizarCalificacion(e)}
          />
          <FotoEstrella
            src={ImgEstrella}
            // key={i}
            // className={tipo}
            // className={` amarilla ${i > qtyEstrella - 1 ? " none " : ""} ${editable ? " editable " : ""}`}
            // className={` amarilla ${calificacionMaster[i] == true ? " aparecer " : ""} ${editable ? " editable " : ""}`}
            className={` amarilla ${calificacionMaster[i] == true ? " aparecer " : ""} ${editable ? " editable " : ""}`}
            data-index={i + 1}
            onClick={(e) => atualizarCalificacion(e)}
          />
        </CajaEstrellaDoble>
      );
    }
    setArrayState(nuevoArray);
  }, [editable, calificacionMaster]);

  const atualizarCalificacion = async (e) => {
    console.log(documento);
    if (documento.estadoDoc != 3) {
      return "";
    }
    if (editable == false) {
      return;
    }
    const { index } = e.target.dataset;
    const numStar = Number(index);

    if (propiedadAfectar == "resenniaVentas") {
      try {
        const docActualizar = doc(db, "transferRequest", documento.id);
        if (propiedadAfectar == "resenniaVentas") {
          await updateDoc(docActualizar, {
            "calificaciones.resenniaVentas.puntuacion": numStar,
            "calificaciones.resenniaVentas.fechaPuntuacion": ES6AFormat(
              new Date()
            ),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const entrarRaton = (e) => {
    if (documento.estadoDoc != 3) {
      return;
    }
    if (editable == false) {
      return;
    }
    const { index } = e.target.dataset;
    const numStar = Number(index);
    console.log(textoMostrar[numStar - 1]);
    setShowText(textoMostrar[numStar - 1]);
    actualizarCalificacion(numStar);
  };
  const salirMouser = (e) => {
    if (editable == false) {
      return;
    }
    const { index } = e.target.dataset;
    const numStar = Number(index);
    console.log(numStar);
    setShowText(textoMostrar[qtyEstrella - 1]);
    // textoMostrar[numStar];
    actualizarCalificacion(qtyEstrella);
  };
  return (
    <Container className={Theme.config.modoClear ? "clearModern" : ""}>
      {/* <BotonQuery
        qtyEstrella={qtyEstrella}
        calificacionMaster={calificacionMaster}
        showText={showText}
      /> */}
      <WrapEstrella>{arrayState}</WrapEstrella>
      {/* <TextoRetornar>{textoMostrar[qtyEstrella - 1]}</TextoRetornar> */}
      <TextoRetornar>{showText}</TextoRetornar>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  background-color: ${Tema.secondary.azulSuave};
  padding: 5px;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
  }
`;
const WrapEstrella = styled.div`
  display: flex;
`;
const FotoEstrella = styled.img`
  width: 100%;
  /* height: 100%; */
  &.slider {
    width: 40px;
    /* height: 40px; */
  }
  &.editable {
    &:hover {
      cursor: pointer;
    }
  }
  &.amarilla {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  &.none {
    display: none;
  }
  &.aparecer {
    display: inline;
  }
  &.vacia {
  }
`;
const TextoRetornar = styled.h2`
  color: white;
  font-size: 1rem;
`;
const CajaEstrellaDoble = styled.div`
  width: 60px;
  position: relative;
`;
