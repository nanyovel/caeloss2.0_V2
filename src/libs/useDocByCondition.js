import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

// ****************** DOCUMENTOS CON ESCUCHADOR **********************
export const useDocByCondition = (
  collectionName,
  setState,
  campo,
  condicion,
  exp2,
  dbEstablecida
) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  useEffect(() => {
    // Este condicional es para que si el usuario ya descargo la base de datos pues que no vuelva a cargar, aunque el componente de desmonte y se vuelva a montar
    if (dbEstablecida?.length > 0) {
      return;
    }
    if (usuario) {
      console.log("DB 😐😐😐😐😐" + collectionName);
      let q;

      if (campo) {
        q = query(
          collection(db, collectionName),
          where(campo, condicion, exp2)
        );
      } else {
        q = query(collection(db, collectionName));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const coleccion = [];
        querySnapshot.forEach((doc) => {
          coleccion.push({ ...doc.data(), id: doc.id });
        });
        setState(coleccion);
        return coleccion;
      });

      // Limpieza de la escucha al desmontar
      return () => unsubscribe();
    }
  }, [collectionName, setState, campo, condicion, exp2, usuario]);
};
//
// ****************** DOCUMENTOS CON ESCUCHADOR con array de condiciones **********************
export const useDocByArrayCondition = (
  collectionName,
  setState,
  condiciones
) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  useEffect(() => {
    if (usuario) {
      console.log("DB 😐😐😐😐😐" + collectionName);
      let q;

      if (true) {
        q = query(
          collection(db, collectionName),
          ...condiciones.map((cond) =>
            where(cond.campo, cond.condicion, cond.valor)
          )
        );
      } else {
        q = query(collection(db, collectionName));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const coleccion = [];
        querySnapshot.forEach((doc) => {
          coleccion.push({ ...doc.data(), id: doc.id });
        });
        setState(coleccion);
        return coleccion;
      });

      // Limpieza de la escucha al desmontar
      return () => unsubscribe();
    }
  }, [collectionName, setState, usuario]);
};

// ****************** DOCUMENTOS CON ESCUCHADOR SIN USEEFFECT Y SIN ESTADO **********************
// *****IMPORTANTE*****
// Debe validarse si el usuario esta logeado y ademas en el useEffect retornar una funcion para detener
// La escucha cuando el componente se desmonte
// *****IMPORTANTE*****
export const fetchDocEscuhadorSinEffect = (
  collectionName,
  setState,
  campo,
  condicion,
  exp2,
  dbEstablecida
) => {
  if (dbEstablecida?.length > 0) {
    return null; // ← Importante que retorne null o undefined si no se activa
  }
  console.log("DB 😐😐😐😐😐" + collectionName);
  let q;

  if (campo) {
    q = query(collection(db, collectionName), where(campo, condicion, exp2));
  } else {
    q = query(collection(db, collectionName));
  }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const coleccion = [];
    querySnapshot.forEach((doc) => {
      coleccion.push({ ...doc.data(), id: doc.id });
    });
    if (setState) {
      setState(coleccion);
    }
    return coleccion;
  });
  return unsubscribe;
};

// ****************** DOCUMENTOS SIN ESCUCHADOR **********************
export const fetchGetDocs = async (
  collectionName,
  setState,
  exp1,
  condicion,
  exp2
) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  useEffect(() => {
    if (usuario) {
      console.log("DB 😐😐😐😐😐" + collectionName);
      const q = exp1
        ? query(collection(db, collectionName), where(exp1, condicion, exp2))
        : query(collection(db, collectionName));

      (async () => {
        try {
          const consultaDB = await getDocs(q);

          const coleccion = consultaDB.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          if (setState) {
            setState(coleccion);
          }
          return coleccion;
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [collectionName, setState, exp1, condicion, exp2, usuario]);
};

// ********* DAME UN UNICO DOC POR SU ID Y SIN ESCUCHADOR **********
export const obtenerDocPorId = async (collectionName, idDoc, setState) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);

  useEffect(() => {
    if (usuario) {
      console.log("DB 😐😐😐😐😐" + collectionName);
      (async () => {
        try {
          const docRef = doc(db, collectionName, idDoc);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const documento = docSnap.data();
            setState(documento);
            return documento;
          } else {
            console.log("No se encontró el documento con ese ID.");
            return null;
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);
};
// ********* DAME UN UNICO DOC POR SU ID, SIN ESCUCHADOR y sin setState NI USEEFFECT **********
// preguntar si usuario existe antes de llamar
export const obtenerDocPorId2 = async (collectionName, idDoc) => {
  console.log("DB 😐😐😐😐😐" + collectionName);
  try {
    const docRef = doc(db, collectionName, idDoc);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const documento = { ...docSnap.data(), id: docSnap.id };
      return documento;
    } else {
      console.log("No se encontró el documento con ese ID.");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

// ************************** DAME SOLO UN DOC POR id con escuchador *****
export const useDocById = (collectionName, setState, idUsuario) => {
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  useEffect(() => {
    if (usuario) {
      console.log("DB 😐😐😐😐", collectionName);
      //   if (usuario) {
      const unsub = onSnapshot(doc(db, collectionName, idUsuario), (doc) => {
        const datos = { ...doc.data(), id: doc.id };
        setState(datos);
      });
      // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
      return () => unsub();
      //   }
    }
  }, [collectionName, setState, idUsuario]);
};

// ************************** DAME SOLO UN DOC POR con escuchador y sin importar que el usuario no se halla logeado*****
export const useDocByIdDangerous = (collectionName, setState, idBuscar) => {
  useEffect(() => {
    console.log("DB 😐😐😐😐", collectionName);
    //   if (usuario) {
    const unsub = onSnapshot(doc(db, collectionName, idBuscar), (doc) => {
      if (setState) {
        setState({ ...doc.data(), id: doc.id });
        return { ...doc.data(), id: doc.id };
      } else {
        return { ...doc.data(), id: doc.id };
      }
    });
    // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
    return () => unsub();
    //   }
  }, [collectionName, setState, idBuscar]);
};
// ************************** DAME SOLO UN DOC POR SU ID con escuchador sin useEffect ni state y sin importar que usuario este logeado
// no se halla logeado*****
export const useDocByIdDangerous2 = (collectionName, setState, idBuscar) => {
  console.log("DB 😐😐😐😐", collectionName);
  //   if (usuario) {
  const unsub = onSnapshot(doc(db, collectionName, idBuscar), (doc) => {
    if (setState) {
      setState({ ...doc.data(), id: doc.id });
      return { ...doc.data(), id: doc.id };
    } else {
      return { ...doc.data(), id: doc.id };
    }
  });
  // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
  return () => unsub();
  //   }
};

// ***** TRAE DOCUMENTOS SIN ESCUCHADOR Y SIN USEEFFECT, SE DEBE COLOCAR UN IF(USUARIO) AL LLAMAR ******
export const fetchDocsByConditionGetDocs = async (
  collectionName,
  setState,
  campo,
  condicion,
  valor,
  campo2,
  condicion2,
  valor2
) => {
  console.log("DB 😐😐😐😐😐" + collectionName);
  let q = {};

  if (campo && !campo2) {
    q = query(collection(db, collectionName), where(campo, condicion, valor));
  } else if (campo2) {
    q = query(
      collection(db, collectionName),
      where(campo, condicion, valor),
      where(campo2, condicion2, valor2)
    );
  } else {
    q = query(collection(db, collectionName));
  }

  const consultaDB = await getDocs(q);
  const coleccion = consultaDB.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  // Si tiene useState de react, entonces guardar ahi
  // setState(coleccion);
  if (setState) {
    setState(coleccion);
  }
  // Si no tiene useState siginifica que es en una variable de js
  return coleccion;
};

// Trae documentos segun un array, utilizando el operador "in"
// Este operador solo funciona con arrays de 10 elementos o menos
// https://firebase.google.com/docs/firestore/query-data/queries#array-contains
// https://firebase.google.com/docs/firestore/query-data/queries#array-contains-any
// https://firebase.google.com/docs/firestore/query-data/queries#in
//  Sin ecuchador ni useEffect

export const fetchDocsByIn = async (
  collectionName,
  setState,
  campo,
  arrayNumeros
) => {
  console.log("DB 😐😐😐😐😐" + collectionName);

  const q = query(
    collection(db, collectionName),
    // COmo funcion in / array-contains en firestore
    // *****in*****
    // le pasas un array de ordenes de compra y te traera esas ordenes de compra
    // Basicamente entiendo que es lo opuesto de array-contains
    // in le pasas un array para comparar contra un string del documento en la DB

    // *****array-contains****
    // array-contains le pasas un string para buscar dentro de un array de string en la db
    // por otro lado existe array-contains-any que entiendo es para pasar un array y comprar con otro array en la db, a fin de que uno de los elementos coincidan

    where(campo, "in", arrayNumeros)
  );

  const consultaDB = await getDocs(q);
  const coleccion = consultaDB.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  // Si tiene useState de react, entonces guardar ahi
  // setState(coleccion);
  if (setState) {
    setState(coleccion);
    return coleccion;
  }
  // Si no tiene useState siginifica que es en una variable de js
  return coleccion;
};

export const fetchDocsByArrayContains = async (
  collectionName,
  setState,
  campo,
  stringBuscar
) => {
  console.log("DB 😐😐😐😐😐" + collectionName);

  const q = query(
    collection(db, collectionName),
    // COmo funcion in / array-contains en firestore
    // *****in*****
    // le pasas un array de string y te traera esos documentos
    // Basicamente entiendo que es lo opuesto de array-contains
    // in le pasas un array para comparar contra un string del documento en la DB

    // *****array-contains****
    // array-contains le pasas un string para buscar dentro de un array de string en la db
    // por otro lado existe array-contains-any que entiendo es para pasar un array y comprar con otro array en la db, a fin de que uno de los elementos coincidan

    where(campo, "array-contains", stringBuscar)
    // where("categorias", "array-contains", "planchas")
  );

  const consultaDB = await getDocs(q);
  const coleccion = consultaDB.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  // Si tiene useState de react, entonces guardar ahi
  // setState(coleccion);
  if (setState) {
    setState(coleccion);
    return coleccion;
  }
  // Si no tiene useState siginifica que es en una variable de js

  return coleccion;
};

// ******************************************************
// ******************************************************
//  DOCUMENTOS SIN ESCUCHADOR :
// por rango de fecha y palabras claves
// sin utilizar hook
// se debe validar que el usuario exista antes de llamar
// utilizado para traer solicitudes con funcion encontrar
// ******************************************************
// ******************************************************
export const fetchEncontrarReq = async (
  tipo,
  collectionName,
  rangoInicio,
  rangoFin,
  palabra,
  tipoDoc,
  idUsuaio
) => {
  let q;
  // Si el usuario no coloca nada, entonces traer todo
  const palabraParsed = palabra.length == 0 ? ["todosloselementos"] : palabra;
  console.log("DB 😐😐😐😐😐" + collectionName);
  if (tipo == "keyWord") {
    q = query(
      collection(db, collectionName),
      where("fechaStamp", ">=", rangoInicio),
      where("fechaStamp", "<=", rangoFin),
      where("palabrasClave.general", "array-contains-any", palabraParsed)
    );
  } else if (tipo == "misSolicitudes") {
    // Por detalles solo creadas por el usuario

    q = query(
      collection(db, collectionName),
      where("fechaStamp", ">=", rangoInicio),
      where("fechaStamp", "<=", rangoFin),
      where("tipo", "==", tipoDoc),
      where("palabrasClave.general", "array-contains-any", palabraParsed),
      where("datosSolicitante.idSolicitante", "==", idUsuaio)
    );
  }

  try {
    const consultaDB = await getDocs(q);

    const coleccion = consultaDB.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return coleccion;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// ******************** TRAE UN GRUPO DE DOCUMENTOS A PARTIR DE UN ARRAY DE IDS ***********************
export const traerGrupoPorIds = async (collectionName, ids) => {
  const docsPromises = ids.map((id) => getDoc(doc(db, collectionName, id)));
  const docsSnapshots = await Promise.all(docsPromises);

  const resultados = docsSnapshots
    .filter((docSnap) => docSnap.exists())
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

  return resultados;
};
