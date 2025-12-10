// ESTO FUE TEMPORAL PARA UNA FERIA EN BABARO, COMENTARIO EL 13 DE JUNIO 2025
// import React, { useState } from "react";
// import styled from "styled-components";
// import { Tema, Theme } from "../config/theme";
// import { Header } from "../components/Header";
// import Footer from "../components/Footer";
// import { QRCodeSVG } from "qrcode.react";
// import {
//   InputSimpleEditable,
//   MenuDesplegable,
// } from "../components/InputGeneral";
// import { BtnGeneralButton } from "../components/BtnGeneralButton";
// import { BotonQuery } from "../components/BotonQuery";
// import { Alerta } from "../components/Alerta";
// import { addDoc, collection } from "firebase/firestore";
// import db from "../firebase/firebaseConfig";
// import { ModalLoading } from "../components/ModalLoading";

// import ImgACM from "./../../public/img/fotos feria/acm.jpeg";
// import ImgDecking from "./../../public/img/fotos feria/decking.avif";
// import ImgLouvers from "./../../public/img/fotos feria/Louvers.jpg";
// import ImgCladding from "./../../public/img/fotos feria/cladding.webp";
// import ImgMolduras from "./../../public/img/fotos feria/molduras.jpg";
// import ImgPaneles from "./../../public/img/fotos feria/Paneles.jpeg";
// import ImgPergolas from "./../../public/img/fotos feria/pergolas.jpg";
// import ImgPetPanel from "./../../public/img/fotos feria/petPanel.jpeg";
// import ImgPuertas from "./../../public/img/fotos feria/puertas.jpeg";
// import ImgMobiliario from "./../../public/img/fotos feria/mobi.jpeg";
// import ImgDeckingInstalado from "./../../public/img/fotos feria/Decking instalado 02.jpeg";
// import ImgPisoVinyl from "./../../public/img/fotos feria/pisoVynil.jpeg";
// import { ES6AFormat } from "../libs/FechaFormat";

// export default function PantallaEditable2() {
//   // // ******************** RECURSOS GENERALES ******************** //
//   const [dispatchAlerta, setDispatchAlerta] = useState(false);
//   const [mensajeAlerta, setMensajeAlerta] = useState("");
//   const [tipoAlerta, setTipoAlerta] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const articulos = [
//     {
//       nombre: "Pet panel",
//       select: false,
//       img: ImgPetPanel,
//     },
//     // {
//     //   nombre: "Cladding",
//     //   select: false,
//     //   img: ImgCladding,
//     // },
//     {
//       nombre: "Madera sintética",
//       select: false,
//       img: ImgDeckingInstalado,
//     },
//     {
//       nombre: "Paneles",
//       select: false,
//       img: ImgPaneles,
//     },
//     {
//       nombre: "ACM",
//       select: false,
//       img: ImgACM,
//     },
//     {
//       nombre: "Louvers",
//       select: false,
//       img: ImgLouvers,
//     },
//     {
//       nombre: "Mobiliario",
//       select: false,
//       img: ImgMobiliario,
//     },
//     {
//       nombre: "Molduras",
//       select: false,
//       img: ImgMolduras,
//     },
//     {
//       nombre: "Pérgolas",
//       img: ImgPergolas,
//       select: false,
//     },
//     {
//       nombre: "Puertas",
//       select: false,
//       img: ImgPuertas,
//     },
//     {
//       nombre: "Piso Vinyl",
//       select: false,
//       img: ImgPisoVinyl,
//     },
//   ];
//   const [listaItem, setListaItem] = useState([...articulos]);
//   const handleItem = (e) => {
//     const nombreDataset = e.target.dataset.nombre;
//     const itemFind = articulos.find((item) => {
//       if (item.nombre == nombreDataset) {
//         return item;
//       }
//     });

//     setListaItem(
//       listaItem.map((item, index) => {
//         return {
//           ...item,
//           select: item.nombre == itemFind.nombre ? !item.select : item.select,
//         };
//       })
//     );
//   };

//   const initialValue = {
//     nombre: "",
//     telefono: "",
//     correo: "",
//     tipo: "",
//     nombreEmpresa: "",
//     rnc: "",
//     articulos: [],
//     comentarios: "",
//   };
//   const [dataSend, setDataSend] = useState({
//     ...initialValue,
//   });
//   const handleInputs = (e) => {
//     const { name, value } = e.target;
//     if (name == "tipo" && value == "clienteParticular") {
//       setDataSend((prevState) => ({
//         ...prevState,
//         nombreEmpresa: "",
//       }));
//     }
//     setDataSend((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//   const enviarDatos = async () => {
//     let proceder = true;
//     // Si el usuario no ha seleccionado ningun articulo
//     const hasSelect = listaItem.some((item) => item.select);
//     if (!hasSelect) {
//       setMensajeAlerta(`Seleccionar materiales`);
//       setTipoAlerta("warning");
//       setDispatchAlerta(true);
//       setTimeout(() => setDispatchAlerta(false), 3000);
//       proceder = false;
//       return "";
//     }
//     // SI el usuario no ha colocado su nombre
//     if (dataSend.nombre == "") {
//       setMensajeAlerta(`Indicar su nombre`);
//       setTipoAlerta("warning");
//       setDispatchAlerta(true);
//       setTimeout(() => setDispatchAlerta(false), 3000);
//       proceder = false;
//       return "";
//     }
//     // SI el usuario no ha colocado su telefono
//     if (dataSend.telefono == "") {
//       setMensajeAlerta(`Indicar su telefono`);
//       setTipoAlerta("warning");
//       setDispatchAlerta(true);
//       setTimeout(() => setDispatchAlerta(false), 3000);
//       proceder = false;
//       return "";
//     }
//     // SI el usuario no ha colocado empresa o particular
//     if (dataSend.telefono == "") {
//       setMensajeAlerta(`Indicar si es una empresa o cliente particular`);
//       setTipoAlerta("warning");
//       setDispatchAlerta(true);
//       setTimeout(() => setDispatchAlerta(false), 3000);
//       proceder = false;
//       return "";
//     }

//     if (proceder) {
//       try {
//         setIsLoading(true);
//         const datoEnviar = {
//           ...dataSend,
//           articulos: listaItem,
//           createdAt: ES6AFormat(new Date()),
//         };
//         console.log(datoEnviar);
//         await addDoc(collection(db, "seleccionVistaCana"), datoEnviar);
//         setMensajeAlerta("Enviado correctamente!.");
//         setTipoAlerta("success");
//         setDispatchAlerta(true);
//         setTimeout(() => setDispatchAlerta(false), 3000);
//         setListaItem([...articulos]);
//         setDataSend({ ...initialValue });
//         setIsLoading(false);
//       } catch (error) {
//         console.log(error);
//         setMensajeAlerta(`Error con la base de datos`);
//         setTipoAlerta("warning");
//         setDispatchAlerta(true);
//         setTimeout(() => setDispatchAlerta(false), 3000);
//         setIsLoading(false);
//       }
//     }
//   };
//   return (
//     <>
//       {/* <Header titulo="Cielos Acusticos" /> */}
//       <CajaLogo>
//         <Logo src="https://caeloss.com/assets/cielos-d4778785.png" />
//       </CajaLogo>
//       <Container>
//         <ContainerMaster>
//           <ContainerSecciones className="contenido">
//             <CajaContenedora>
//               <CajaTitulo>
//                 <Titulo>¡Hola! Gracias por visitar Nuestro Stand.</Titulo>
//                 <Titulo>Queremos conocerte</Titulo>
//               </CajaTitulo>
//               <CajaDetalles>
//                 <TituloCaja className="radio">Tipo</TituloCaja>
//                 <Label className="radio">
//                   <InputSimple
//                     type="radio"
//                     placeholder="empresa / cliente particular"
//                     name="tipo"
//                     className="radio"
//                     value={"clienteParticular"}
//                     onChange={(e) => handleInputs(e)}
//                     autoComplete="off"
//                   />
//                   Cliente particular
//                 </Label>
//                 <Label className="radio">
//                   <InputSimple
//                     placeholder="empresa / cliente particular"
//                     name="tipo"
//                     type="radio"
//                     className="radio"
//                     value={"empresa"}
//                     onChange={(e) => handleInputs(e)}
//                     autoComplete="off"
//                   />
//                   Empresa
//                 </Label>
//               </CajaDetalles>
//               {dataSend.tipo == "empresa" && (
//                 <>
//                   <CajaDetalles>
//                     <TituloCaja>RNC</TituloCaja>
//                     <InputSimple
//                       placeholder="RNC"
//                       name="rnc"
//                       value={dataSend.rnc}
//                       onChange={(e) => handleInputs(e)}
//                       autoComplete="off"
//                     />
//                   </CajaDetalles>
//                   <CajaDetalles>
//                     <TituloCaja>Nombre de la empresa</TituloCaja>
//                     <InputSimple
//                       placeholder="Nombre empresa"
//                       name="nombreEmpresa"
//                       value={dataSend.nombreEmpresa}
//                       onChange={(e) => handleInputs(e)}
//                       autoComplete="off"
//                     />
//                   </CajaDetalles>
//                 </>
//               )}
//               <CajaDetalles>
//                 <TituloCaja>Nombre</TituloCaja>
//                 <InputSimple
//                   placeholder="Nombre"
//                   name="nombre"
//                   value={dataSend.nombre}
//                   onChange={(e) => handleInputs(e)}
//                   autoComplete="off"
//                 />
//               </CajaDetalles>
//               <CajaDetalles>
//                 <TituloCaja>Teléfono</TituloCaja>
//                 <InputSimple
//                   placeholder="Telefono"
//                   name="telefono"
//                   value={dataSend.telefono}
//                   onChange={(e) => handleInputs(e)}
//                   autoComplete="off"
//                 />
//               </CajaDetalles>
//               <CajaDetalles>
//                 <TituloCaja>Correo</TituloCaja>
//                 <InputSimple
//                   placeholder="Correo"
//                   name="correo"
//                   value={dataSend.correo}
//                   onChange={(e) => handleInputs(e)}
//                   autoComplete="off"
//                 />
//               </CajaDetalles>

//               <TituloCaja className="tituloLarge">
//                 Selecciona los productos que te interesaron:
//               </TituloCaja>
//               <ContenedorItems>
//                 {listaItem.map((item, index) => {
//                   return (
//                     <WrapItem
//                       key={index}
//                       className={item.select ? "selected" : ""}
//                       onClick={(e) => handleItem(e)}
//                       data-nombre={item.nombre}
//                     >
//                       <Img
//                         src={
//                           item.img
//                             ? item.img
//                             : "https://i.ibb.co/S4mwj5BM/gallery-large-876-657-removebg-preview.png"
//                         }
//                         className={item.select ? "selected" : ""}
//                         onClick={(e) => handleItem(e)}
//                         data-nombre={item.nombre}
//                       />
//                       <TituloItem
//                         className={item.select ? "selected" : ""}
//                         onClick={(e) => handleItem(e)}
//                         data-nombre={item.nombre}
//                       >
//                         {item.nombre}
//                       </TituloItem>
//                     </WrapItem>
//                   );
//                 })}
//               </ContenedorItems>
//               <CajaDetalles>
//                 <TituloCaja>Comentarios</TituloCaja>
//                 <TextArea
//                   placeholder="Comentarios"
//                   name="comentarios"
//                   value={dataSend.comentarios}
//                   onChange={(e) => handleInputs(e)}
//                   autoComplete="off"
//                 />
//               </CajaDetalles>

//               <CajaBtnFinal>
//                 <BtnSimple onClick={() => enviarDatos()}>Enviar</BtnSimple>
//               </CajaBtnFinal>
//             </CajaContenedora>
//           </ContainerSecciones>
//           <ContainerSecciones>
//             <Footer />
//           </ContainerSecciones>
//         </ContainerMaster>
//       </Container>
//       <Alerta
//         estadoAlerta={dispatchAlerta}
//         tipo={tipoAlerta}
//         mensaje={mensajeAlerta}
//       />
//       {isLoading ? <ModalLoading completa={true} /> : ""}
//     </>
//   );
// }

// const Container = styled.div`
//   padding: 0 15px;
//   width: 100%;
//   min-height: 200px;
//   @media screen and (max-width: 400px) {
//     padding: 0 8px;
//   }
// `;
// const ContainerMaster = styled.div`
//   position: relative;
//   min-height: 100dvh;
//   /* display: grid;
//   grid-template-rows: auto 1fr auto; */

//   display: flex;
//   flex-direction: column;
//   margin-top: 50px;
// `;
// const ContainerSecciones = styled.div`
//   &.contenido {
//     width: 100%;
//     margin-bottom: 100px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }
//   &.footer {
//     position: absolute;
//     bottom: 0;
//     width: 100%;
//     height: 40px;
//   }
// `;

// const CajaTitulo = styled.div`
//   width: 100%;
//   padding: 15px;
//   @media screen and (max-width: 510px) {
//     padding: 8px;
//   }
//   @media screen and (max-width: 430px) {
//     padding: 4px;
//   }
//   @media screen and (max-width: 460px) {
//     padding: 2px;
//   }
// `;
// const Titulo = styled.h2`
//   color: ${Tema.primary.azulBrillante};
//   text-decoration: underline;
//   text-align: center;
//   font-size: 1.5rem;
//   @media screen and (max-width: 510px) {
//     font-size: 1.4rem;
//   }
//   @media screen and (max-width: 460px) {
//     font-size: 1.3rem;
//   }
//   @media screen and (max-width: 430px) {
//     font-size: 1.2rem;
//   }
//   @media screen and (max-width: 390px) {
//     font-size: 1.1rem;
//   }
//   @media screen and (max-width: 360px) {
//     font-size: 1rem;
//   }
//   @media screen and (max-width: 360px) {
//     font-size: 0.9rem;
//   }
// `;

// const CajaContenedora = styled.div`
//   border: 1px solid ${Tema.primary.grisNatural};
//   border-radius: 5px;
//   width: 65%;
//   padding: 10px;

//   &.anchoCompleto {
//     width: 100%;
//   }
//   @media screen and (max-width: 960px) {
//     width: 90%;
//     margin-bottom: 100px;
//   }

//   @media screen and (max-width: 720px) {
//     width: 100%;
//     padding: 4px;
//   }
// `;

// const CajaDetalles = styled.div`
//   /* border: 1px solid white; */
//   display: flex;
//   flex-direction: column;
//   width: 50%;
//   margin: auto;
//   margin-bottom: 15px;
//   &.boton {
//     margin-top: 20px;
//   }
//   &.lista {
//     width: 30%;
//     /* border: 1px solid blue; */
//     margin: 0;
//     justify-content: center;
//     align-items: center;
//   }
//   &.tabla {
//     width: 100%;
//   }
//   @media screen and (max-width: 850px) {
//     width: 90%;
//   }
// `;
// const TituloCaja = styled.p`
//   color: ${Tema.secondary.azulBrillanteTG};

//   &.radio {
//     margin-bottom: 5px;
//   }
//   &.tituloLarge {
//     /* border: 1px solid red; */
//     text-align: center;
//     font-size: 1.4rem;
//     text-decoration: underline;
//     margin-bottom: 10px;
//     @media screen and (max-width: 480px) {
//       font-size: 1.2rem;
//     }
//     @media screen and (max-width: 360px) {
//       font-size: 1rem;
//       margin-bottom: 15px;
//     }
//   }
// `;
// const InputSimple = styled(InputSimpleEditable)`
//   height: 35px;
//   width: 100%;
//   &.checkbox {
//     width: 25px;
//     height: 25px;
//     min-width: 25px;
//     margin-right: 8px;
//   }
//   &.radio {
//     width: 25px;
//     height: 25px;
//     min-width: 25px;
//     margin-right: 8px;
//   }
// `;
// const TextArea = styled.textarea`
//   border: none;
//   min-height: 70px;
//   outline: none;
//   border-radius: 4px;
//   padding: 5px;
//   background-color: ${Tema.secondary.azulGraciel};
//   color: ${Tema.primary.azulBrillante};
//   resize: vertical;
//   width: 100%;
//   &:focus {
//     border: 1px solid ${Tema.primary.azulBrillante};
//   }
//   &.lista {
//     min-height: 35px;
//     max-height: 200px;
//     height: 35px;
//   }
//   &.tabla {
//     width: 180px;
//   }
//   @media screen and (max-width: 800px) {
//     width: 220px;
//     /* flex-direction: column; */
//   }
// `;
// const CajaBtnFinal = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   margin-top: 40px;
// `;
// const BtnSimple = styled(BtnGeneralButton)`
//   width: 50%;
//   margin: auto;
//   height: 40px;
// `;

// const Label = styled.label`
//   color: ${Theme.neutral.blancoHueso};
//   display: flex;
//   border-bottom: 1px solid ${Theme.neutral.blancoHueso};
//   &.radio {
//     margin-bottom: 5px;
//   }
// `;
// const ContenedorItems = styled.div`
//   display: flex;
//   gap: 15px;
//   justify-content: center;
//   margin-bottom: 15px;
//   flex-wrap: wrap;
// `;
// const WrapItem = styled.div`
//   width: 45%;
//   height: 180px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   border: 2px solid ${Theme.primary.grisNatural};
//   border-radius: 4px;
//   padding: 8px;
//   transition: all 0.2s ease;
//   &.selected {
//     border-color: ${Theme.primary.azulBrillante};
//     transform: scale(1.2);
//   }
//   @media screen and (max-width: 650px) {
//     width: 45%;
//   }
// `;
// const Img = styled.img`
//   height: 70%;
//   max-width: 100%;
//   filter: grayscale(1);
//   transition: filter ease 0.4s;
//   &.selected {
//     filter: grayscale(0);
//   }
// `;
// const TituloItem = styled.h2`
//   color: ${Theme.primary.azulBrillante};
//   filter: grayscale(1);
//   &.selected {
//     filter: grayscale(0);
//   }
// `;
// const CajaLogo = styled.div`
//   display: flex;
//   justify-content: center;
//   background-color: ${Theme.primary.grisNatural};
//   background-color: white;
//   height: 100px;
//   margin-bottom: 40px;
//   margin-top: 50px;
// `;
// const Logo = styled.img`
//   width: 50%;
//   object-fit: contain;
// `;
