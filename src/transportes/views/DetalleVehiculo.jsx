// COMENTADO EL 24 JUNIO 2025
//
//
//

// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import { BtnGeneralButton } from "../../components/BtnGeneralButton";
// import { BotonQuery } from "../../components/BotonQuery";
// import {
//   addDoc,
//   collection,
//   onSnapshot,
//   query,
//   where,
// } from "firebase/firestore";
// import db from "../../firebase/firebaseConfig";
// import { ModalLoading } from "../../components/ModalLoading";
// import { Alerta } from "../../components/Alerta";
// import { OpcionUnica } from "../../components/OpcionUnica";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import ImgPlataneta from "../../fletes/img/carros/platanera.png";
// import ImgPlatanera10Pies from "../../fletes/img/carros/platanera10Pies.png";
// import ImgCamaLarga from "../../fletes/img/carros/camaLarga.png";
// import ImgRigido from "../../fletes/img/carros/rigido.png";
// import ImgPatana from "../../fletes/img/carros/patana.png";
// import camionGenerico from "./../img/camion.png";
// import { useAuth } from "../../context/AuthContext";
// import { useParams } from "react-router-dom";
// import { parseRenglon } from "../components/libs";
// import ControlesDoc from "../components/ControlesDoc";
// import { Tema } from "../../config/theme";

// export default function DetalleVehiculo({ userMaster, modoDisabled }) {
//   const usuario = useAuth();

//   const useDocByCondition = (
//     collectionName,
//     setState,
//     exp1,
//     condicion,
//     exp2
//   ) => {
//     useEffect(() => {
//       if (usuario) {
//         console.log("BASE de Datos 📄📄📄📄👨‍🏫👨‍🏫👨‍🏫📄📄👨‍🏫👨‍🏫");
//         let q = "";

//         if (exp1) {
//           q = query(
//             collection(db, collectionName),
//             where(exp1, condicion, exp2)
//           );
//         } else {
//           q = query(collection(db, collectionName));
//         }

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//           const colecion = [];
//           querySnapshot.forEach((doc) => {
//             // console.log(doc.data())
//             colecion.push({ ...doc.data(), id: doc.id });
//           });
//           setState(colecion);
//         });
//         // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
//         return () => unsubscribe();
//       }
//     }, [collectionName, setState, exp1, condicion, exp2, usuario]);
//   };

//   const [vehiculoMaster, setVehiculosMaster] = useState({});
//   const docUser = useParams().id;
//   useDocByCondition(
//     "vehiculos",
//     setVehiculosMaster,
//     "numeroDoc",
//     "==",
//     docUser
//   );

//   // // ******************** RECURSOS GENERALES ******************** //
//   const [dispatchAlerta, setDispatchAlerta] = useState(false);
//   const [mensajeAlerta, setMensajeAlerta] = useState("");
//   const [tipoAlerta, setTipoAlerta] = useState("");

//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditanto, setIsEditando] = useState(false);
//   // ******************************MANEJANDO LOS INPUTS********************************
//   const [arrayOpciones, setArrayOpciones] = useState([
//     {
//       nombre: "Interno",
//       opcion: 0,
//       select: true,
//     },
//     {
//       nombre: "Generico",
//       opcion: 1,
//       select: false,
//     },
//   ]);
//   const handleOpciones = (e) => {
//     let index = Number(e.target.dataset.id);
//     setArrayOpciones((prevOpciones) =>
//       prevOpciones.map((opcion, i) => ({
//         ...opcion,
//         select: i === index,
//       }))
//     );
//   };

//   // *********************************USEEFFECT MASTER INICIAL**********************
//   const [datosParseados, setDatosParseados] = useState(false);

//   const [vehiculoEditable, setVehiculoEditable] = useState({});

//   useEffect(() => {
//     if (vehiculoMaster && vehiculoMaster[0]) {
//       console.log(vehiculoMaster[0]);
//       setVehiculoEditable(vehiculoMaster[0]);

//       setDatosParseados(true);
//     }
//   }, [userMaster, vehiculoMaster]);

//   // *************** MANEJANDO LOS INPUTS***************
//   const handleInput = (e) => {
//     const { name, value } = e.target;

//     setVehiculoEditable((preventState) => ({
//       ...preventState,
//       [name]: value,
//     }));
//   };
//   const enviarObjeto = async () => {
//     setIsLoading(true);

//     try {
//       const vehiculoEnviar = {
//         ...vehiculoEditable,
//         fechaCreacion: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
//           locale: es,
//         }),
//         generico: arrayOpciones[1].select,
//       };

//       await addDoc(collection(db, "vehiculos"), vehiculoEnviar);
//       setMensajeAlerta("Chofer creado con exito..");
//       setTipoAlerta("success");
//       setDispatchAlerta(true);
//       setTimeout(() => {
//         setDispatchAlerta(false);
//       }, 3000);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//       setMensajeAlerta("Error con la base de datos");
//       setTipoAlerta("error");
//       setDispatchAlerta(true);
//       setTimeout(() => {
//         setDispatchAlerta(false);
//       }, 3000);
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       <BotonQuery
//         vehiculoEditable={vehiculoEditable}
//         vehiculoMaster={vehiculoMaster}
//       />
//       {datosParseados && (
//         <>
//           <ContainerSuperior>
//             <ControlesDoc titulo={"Detalles vehiculo:"} tipo={"vehiculo"} />
//             <Container>
//               <CajasInterna>
//                 <CajaFotoVehiculo>
//                   {vehiculoEditable.tipoVehiculo ? (
//                     <ImgSimple
//                       className="tipoVehiculo"
//                       src={
//                         vehiculoEditable.tipoVehiculo == "platanera"
//                           ? ImgPlataneta
//                           : vehiculoEditable.tipoVehiculo == "camion10"
//                             ? ImgPlatanera10Pies
//                             : vehiculoEditable.tipoVehiculo == "camaLarga"
//                               ? ImgCamaLarga
//                               : vehiculoEditable.tipoVehiculo == "rigido"
//                                 ? ImgRigido
//                                 : vehiculoEditable.tipoVehiculo == "patana"
//                                   ? ImgPatana
//                                   : ""
//                       }
//                     />
//                   ) : (
//                     <ImgSimple src={camionGenerico} className="tipoVehiculo" />
//                   )}
//                 </CajaFotoVehiculo>
//                 <CajaOpcionUnica>
//                   {isEditanto ? (
//                     <OpcionUnica
//                       //  titulo="Pantallas:"
//                       name="genericoInterno"
//                       arrayOpciones={arrayOpciones}
//                       handleOpciones={handleOpciones}
//                     />
//                   ) : (
//                     <CajitaDetalle>
//                       <TituloDetalle>Interno/Generico:</TituloDetalle>
//                       <DetalleTexto>
//                         {vehiculoEditable.generico ? "Generico" : "Interno"}
//                       </DetalleTexto>
//                     </CajitaDetalle>
//                   )}
//                 </CajaOpcionUnica>
//                 <CajitaDetalle>
//                   <TituloDetalle>Tipo de vehiculo:</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto
//                       title={parseRenglon(vehiculoEditable.tipoVehiculo)}
//                     >
//                       {parseRenglon(vehiculoEditable.tipoVehiculo)}
//                     </DetalleTexto>
//                   ) : (
//                     <MenuDesplegable
//                       value={vehiculoEditable.tipoVehiculo}
//                       name="tipoVehiculo"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     >
//                       <Opciones value="" defaultValue disabled defaultChecked>
//                         Selecion tipo
//                       </Opciones>
//                       <Opciones value="platanera">
//                         Mini truck 7' (Platanera)
//                       </Opciones>
//                       <Opciones value="camion10">Mini truck 10'</Opciones>
//                       <Opciones value="camaLarga">
//                         Camion 16' (Cama larga)
//                       </Opciones>
//                       <Opciones value="rigido">Camion Rigido 24'</Opciones>
//                       <Opciones value="patana">
//                         Camion trailer 40' (Patana)
//                       </Opciones>
//                     </MenuDesplegable>
//                   )}
//                 </CajitaDetalle>
//                 <CajitaDetalle>
//                   <TituloDetalle>Ficha:</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto title={vehiculoEditable.numeroDoc}>
//                       {vehiculoEditable.numeroDoc}
//                     </DetalleTexto>
//                   ) : (
//                     <InputEditable
//                       type="text"
//                       value={vehiculoEditable.numeroDoc}
//                       name="numeroDoc"
//                       autoComplete="off"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     />
//                   )}
//                 </CajitaDetalle>
//                 <CajitaDetalle>
//                   <TituloDetalle>Modelo:</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto title={vehiculoEditable.modelo}>
//                       {vehiculoEditable.modelo}
//                     </DetalleTexto>
//                   ) : (
//                     <InputEditable
//                       type="text"
//                       value={vehiculoEditable.modelo}
//                       name="modelo"
//                       autoComplete="off"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     />
//                   )}
//                 </CajitaDetalle>
//                 <CajitaDetalle>
//                   <TituloDetalle>Placa:</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto title={vehiculoEditable.placa}>
//                       {vehiculoEditable.placa}
//                     </DetalleTexto>
//                   ) : (
//                     <InputEditable
//                       type="text"
//                       value={vehiculoEditable.placa}
//                       name="placa"
//                       autoComplete="off"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     />
//                   )}
//                 </CajitaDetalle>
//                 <CajitaDetalle>
//                   <TituloDetalle>Capacidad carga (lib):</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto title={vehiculoEditable.capacidadCarga}>
//                       {vehiculoEditable.capacidadCarga}
//                     </DetalleTexto>
//                   ) : (
//                     <InputEditable
//                       type="text"
//                       value={vehiculoEditable.capacidadCarga}
//                       name="capacidadCarga"
//                       autoComplete="off"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     />
//                   )}
//                 </CajitaDetalle>
//                 <CajitaDetalle>
//                   <TituloDetalle>Tamaño cama (pies):</TituloDetalle>
//                   {isEditanto == false ? (
//                     <DetalleTexto title={vehiculoEditable.largoCama}>
//                       {vehiculoEditable.largoCama}
//                     </DetalleTexto>
//                   ) : (
//                     <InputEditable
//                       type="text"
//                       value={vehiculoEditable.largoCama}
//                       name="largoCama"
//                       autoComplete="off"
//                       onChange={(e) => {
//                         handleInput(e);
//                       }}
//                     />
//                   )}
//                 </CajitaDetalle>
//               </CajasInterna>
//             </Container>
//             {isEditanto && (
//               <BtnSimple onClick={() => enviarObjeto()}>Enviar</BtnSimple>
//             )}
//           </ContainerSuperior>
//         </>
//       )}
//       {isLoading ? <ModalLoading completa={true} /> : ""}
//       <Alerta
//         estadoAlerta={dispatchAlerta}
//         tipo={tipoAlerta}
//         mensaje={mensajeAlerta}
//       />
//     </>
//   );
// }
// const ContainerSuperior = styled.div`
//   text-align: center;
//   background-color: ${Tema.secondary.azulProfundo};
//   /* border: 2px solid red; */
//   padding: 15px;
// `;

// const ImgSimple = styled.img`
//   width: 100px;
//   height: 100px;
//   object-fit: contain;
//   border: 2px solid ${Tema.primary.azulBrillante};
//   border-radius: 50%;
//   &.tipoVehiculo {
//     border-radius: 0;
//     width: 300px;
//     height: 300px;
//     border: none;
//   }
// `;
// const Container = styled.div`
//   border: 2px solid ${Tema.neutral.blancoHueso};
//   border-radius: 10px;
//   display: flex;
//   justify-content: center;
// `;

// const CajasInterna = styled.div`
//   width: 50%;
//   border-radius: 10px;
//   padding: 10px;
//   border: 2px solid ${Tema.neutral.blancoHueso};
//   /* border: 2px solid red; */
// `;
// const CajaOpcionUnica = styled.div``;
// const CajitaDetalle = styled.div`
//   display: flex;
//   border-bottom: 1px solid ${Tema.secondary.azulOpaco};
//   display: flex;
//   justify-content: space-between;
//   color: ${Tema.secondary.azulOpaco};
//   &.item {
//     width: 100%;
//     flex-direction: column;
//     padding: 10px;
//   }
//   &.cajaBtn {
//     background-color: transparent;
//     justify-content: center;
//   }
//   &.cajaTitulo {
//     border: none;
//   }
//   &.cajaDetalles {
//     flex-direction: column;
//   }
// `;

// const TituloDetalle = styled.p`
//   width: 50%;
//   padding-left: 5px;
//   color: inherit;
//   text-align: start;
//   &.tituloArray {
//     text-decoration: underline;
//   }
//   &.modoDisabled {
//     text-decoration: underline;
//   }
// `;
// const DetalleTexto = styled.p`
//   text-align: end;
//   height: 20px;
//   width: 49%;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   color: inherit;
//   &.textArea {
//     width: 100%;
//     white-space: initial;
//     text-overflow: initial;
//     height: auto;
//     padding: 5px;
//     text-align: start;
//     padding-left: 15px;
//     min-height: 90px;
//   }
//   &.itemArray {
//     padding: 5px;
//     width: 50%;
//     height: 31px;
//   }
// `;
// const BtnSimple = styled(BtnGeneralButton)``;

// const InputCelda = styled.input`
//   border: none;
//   outline: none;
//   height: 25px;
//   padding: 5px;
//   background-color: ${Tema.secondary.azulGraciel};
//   &.filaSelected {
//     background-color: inherit;
//   }
//   border: none;
//   color: ${Tema.primary.azulBrillante};
//   width: 100%;
//   display: flex;
//   &:focus {
//     border: 1px solid ${Tema.primary.azulBrillante};
//   }
// `;
// const InputEditable = styled(InputCelda)`
//   height: 30px;
//   width: 50%;
//   border-radius: 5px;
//   font-size: 0.8rem;
//   padding: 4px;
//   border-radius: 4px;

//   margin: 0;
//   &.codigo {
//     width: 65px;
//   }
//   &.celda {
//     width: 100%;
//   }
// `;
// const CajaFotoVehiculo = styled.div`
//   width: 100%;
// `;

// const MenuDesplegable = styled.select`
//   outline: none;
//   border: none;
//   background-color: ${Tema.secondary.azulGraciel};
//   height: 30px;
//   width: 50%;
//   border-radius: 4px;
//   &.cabecera {
//     border: 1px solid ${Tema.secondary.azulOscuro2};
//   }
//   color: ${Tema.primary.azulBrillante};

//   &:focus {
//     border: 1px solid ${Tema.primary.azulBrillante};
//   }
// `;

// const Opciones = styled.option`
//   border: none;
//   background-color: ${Tema.secondary.azulProfundo};
// `;
