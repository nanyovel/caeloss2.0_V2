import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { DetalleItem } from "../view/DetalleItem";
import { Alerta } from "../../components/Alerta";
import { BotonQuery } from "../../components/BotonQuery";
import { useAuth } from "../../context/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { OrdenParsedConDespDB } from "../libs/OrdenParsedConDespDB";

export const ListaArticulo = ({ userMaster }) => {
  // **********************Recursos generales**********************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const parametro = useParams();
  const docUser = parametro.id;

  // ****************** DOCUMENTOS CON ESCUCHADOR **********************
  const useDocByCondition = (
    collectionName,
    setState,
    campo,
    condicion,
    exp2,
    campoEstado,
    condicionEstado,
    valorEstado
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
            where(campo, condicion, exp2),
            where(campoEstado, condicionEstado, valorEstado)
          );
        } else {
          q = query(collection(db, collectionName));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const coleccion = [];
          querySnapshot.forEach((doc) => {
            coleccion.push({ ...doc.data(), id: doc.id });
          });
          if (coleccion.length > 0) {
            setState(coleccion);
            return coleccion;
          } else {
            setState(null);
            return null;
          }
        });

        // Limpieza de la escucha al desmontar
        return () => unsubscribe();
      }
    }, [collectionName, setState, campo, condicion, exp2, usuario]);
  };

  // ***************** LLAMADAS A LAS DB *****************
  const [ordenesDB, setOrdenesDB] = useState([]);
  const [furgonesDB, setFurgonesDB] = useState([]);
  const [blsCargaSuelta, setBlsCargaSuelta] = useState([]);
  // Dame todas de este articulos y que esten abiertas
  useDocByCondition(
    "ordenesCompra2",
    setOrdenesDB,
    "arrayItems",
    "array-contains",
    docUser,
    "estadoDoc",
    "<",
    2
  );

  // Dame todos los furgones de este articulo y que esten abiertos
  useDocByCondition(
    "furgones",
    setFurgonesDB,
    "arrayItems",
    "array-contains",
    docUser,
    "status",
    "!=",
    5
  );

  // Dame todos los BL con carga suelta y que esten abiertos
  useDocByCondition(
    "billOfLading2",
    setBlsCargaSuelta,
    "estadoDoc",
    "==",
    0,
    "fleteSuelto.numeroDoc",
    "!=",
    ""
  );
  // ***************** CONSOLIDACION *****************
  const [itemsFurgon, setItemsFurgon] = useState([]);
  const [itemsOrden, setItemsOrden] = useState([]);
  const [cargaFurgones, setCargaFurgones] = useState("loading");
  const [cargaOrdenes, setCargaOrdenes] = useState("loading");
  useEffect(() => {
    // Dame los materiales de carga suelta
    // Dame los materiales de furgones
    // Genera un conglomerado
    // Filtra ese conglomerado y deja solo los de este item
    // Dame los materiales de las ordenes

    const partidasCargaSuelta =
      blsCargaSuelta?.flatMap((bl) => bl.fleteSuelto.partidas) || [];
    const matCargaSuelta = partidasCargaSuelta?.flatMap((part) =>
      part.materiales.map((item) => {
        return {
          ...item,
          isCargaSuelta: true,
          datosFurgon: part,
        };
      })
    );
    console.log(matCargaSuelta);
    const matFurgones =
      furgonesDB?.flatMap((furgon) =>
        furgon.materiales.map((mat) => {
          return {
            ...mat,
            datosFurgon: furgon,
          };
        })
      ) || [];
    const congloFurgones = [...matCargaSuelta, ...matFurgones];

    const congloItemFurgones = congloFurgones.filter(
      (mat) => mat.codigo == docUser
    );
    setItemsFurgon(congloItemFurgones);
    const matOrdenes = ordenesDB?.flatMap((orden) => orden.materiales) || [];
    setItemsOrden(matOrdenes);

    // LOADING
    if (congloItemFurgones.length == 0) {
      setCargaFurgones("sinCantidades");
    } else if (congloItemFurgones.length > 0) {
      setCargaFurgones("");
    }
    if (matOrdenes.length == 0) {
      setCargaOrdenes("sinCantidades");
    } else if (matOrdenes.length > 0) {
      setCargaOrdenes("");
    }
  }, [ordenesDB, furgonesDB, blsCargaSuelta]);

  return (
    <>
      <BotonQuery />
      <Contenedor>
        {
          <DetalleItem
            //
            userMaster={userMaster}
            cargaFurgones={cargaFurgones}
            cargaOrdenes={cargaOrdenes}
            itemsFurgon={itemsFurgon}
            itemsOrden={itemsOrden}
          />
        }
      </Contenedor>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const Contenedor = styled.div`
  /* position: relative; */
  /* height: <audio src=""></audio>%; */
  height: auto;
  /* padding: 10px; */
  /* background-color: red; */
  margin-bottom: 100px;
`;
