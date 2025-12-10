// Comentado el 1/4/25 pero hace tiempo estaba deprecado

//
// import { useState } from "react";
// import styled from "styled-components";
// import { BtnGeneralButton } from "../components/BtnGeneralButton";
// import { Alerta } from "../components/Alerta";
// import db, { autenticar } from "../firebase/firebaseConfig";
// import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { ModalLoading } from "../components/ModalLoading";
// import { doc, setDoc } from "firebase/firestore";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Header } from "../components/Header";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// import { UserSchema } from "../models/AuthSchema.js";
// import { Tema } from "../config/theme.jsx";

// export const Register = ({ home }) => {
//   // Alertas
//   const [dispatchAlerta, setDispatchAlerta] = useState(false);
//   const [mensajeAlerta, setMensajeAlerta] = useState("");
//   const [tipoAlerta, setTipoAlerta] = useState("");

//   // ******************** ENVIANDO A LA BASE DE DATOS******************** //
//   const [isLoading, setIsLoading] = useState(false);

//   const auth = getAuth();
//   auth.languageCode = "es";
//   const navigate = useNavigate();
//   const [datosInput, setDatosInput] = useState({
//     correo: "",
//     password: "",
//     repetirPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPassword2, setShowPassword2] = useState(false);

//   const handleInput = (e) => {
//     const { name, value } = e.target;

//     setDatosInput({
//       ...datosInput,
//       [name]: value,
//     });
//   };
//   // ************** SET DE PRIVILEGIOS  ****************
//   const initialPrivilegios = [
//     {
//       code: "fullAccessIMS",
//       valor: false,
//       descripcion:
//         "Acceso total al sistema de gestion de importaciones, abarca lectura y escritura en su totalidad.",
//     },
//     {
//       code: "fullAccessTMS",
//       valor: false,
//       descripcion:
//         "Acceso total al sistema de gestion de transporte, abarca lectura y escritura en su totalidad.",
//     },
//     {
//       code: "fullAccessMMS",
//       valor: false,
//       descripcion:
//         "Acceso total al sistema de gestion de mantenimiento, abarca lectura y escritura en su totalidad.",
//     },
//     {
//       code: "fullAccessDashboard",
//       valor: false,
//       descripcion:
//         "Acceso total al dashboard, abarca lectura y escritura en su totalidad.",
//     },
//     {
//       code: "accessRoot",
//       valor: false,
//       descripcion: "Control total sobre Caeloss en su totalidad.",
//     },
//   ];

//   const initialValueNuevoUser = {
//     ...UserSchema,
//     privilegios: [...initialPrivilegios],
//     fechaRegistro: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
//       locale: es,
//     }),
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let validacion = {
//       hasCamposLlenos: true,
//       hasCorreoGrupo: true,
//       passwordIguales: true,
//     };

//     // Si existe algun campo vacio
//     if (
//       datosInput.correo == "" ||
//       datosInput.password == "" ||
//       datosInput.repetirPassword == ""
//     ) {
//       setMensajeAlerta("Llena todos los campos.");
//       setTipoAlerta("error");
//       setDispatchAlerta(true);
//       setTimeout(() => {
//         setDispatchAlerta(false);
//       }, 3000);
//       validacion.hasCamposLlenos = false;
//       return;
//     }

//     // Si el correo no es correcto
//     const expReg = {
//       correo: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
//       correoCielos: /^[\w-]+(?:\.[\w-]+)*@(?:cielosacusticos\.com)$/,
//       correoPyL: /^[\w-]+(?:\.[\w-]+)*@(?:pyldecoraciones\.com)$/,
//       // correoPosto: /^[\w-]+(?:\.[\w-]+)*@(?:postodesign\.com)$/,
//       // correoServiCielos: /^[\w-]+(?:\.[\w-]+)*@(?:servicielos\.com)$/,
//     };

//     if (expReg.correo.test(datosInput.correo) == false) {
//       setMensajeAlerta("Correo incorrecto.");
//       setTipoAlerta("error");
//       setDispatchAlerta(true);
//       setTimeout(() => {
//         setDispatchAlerta(false);
//       }, 3000);
//       validacion.hasCorreo = false;
//       return;
//     } else {
//       // Si el correo no tiene un dominio del grupo
//       // 555555555
//       if (
//         expReg.correoCielos.test(datosInput.correo) == false &&
//         expReg.correoPyL.test(datosInput.correo) == false
//         // expReg.correoPosto.test(datosInput.correo) == false
//         // expReg.correoServiCielos.test(datosInput.correo) == false
//       ) {
//         setMensajeAlerta("Dominio no autorizado.");
//         setTipoAlerta("error");
//         setDispatchAlerta(true);
//         setTimeout(() => {
//           setDispatchAlerta(false);
//         }, 3000);
//         validacion.hasCorreoGrupo = false;
//         return;
//       }
//     }

//     // Si las contraseñas son distintas
//     if (datosInput.password !== datosInput.repetirPassword) {
//       setMensajeAlerta("Contraseñas distintas.");
//       setTipoAlerta("error");
//       setDispatchAlerta(true);
//       setTimeout(() => {
//         setDispatchAlerta(false);
//       }, 3000);
//       validacion.passwordIguales = false;
//       return;
//     }

//     // Si todo esta correcto
//     if (
//       validacion.hasCamposLlenos == true &&
//       validacion.hasCorreoGrupo == true &&
//       validacion.passwordIguales == true
//     ) {
//       setIsLoading(true);
//       try {
//         await createUserWithEmailAndPassword(
//           autenticar,
//           datosInput.correo,
//           datosInput.password
//         );
//         // const auth = getAuth();
//         const usuar = auth.currentUser;
//         console.log(usuar);

//         let newUserEnviar = {
//           ...initialValueNuevoUser,
//           correo: usuar.email,
//           userName: usuar.email.split("@")[0],
//           // idUsuario:usuar.uid
//         };
//         try {
//           // await addDoc(collection(db,'usuarios'),newUserEnviar)
//           await setDoc(doc(db, "usuarios", usuar.uid), newUserEnviar);
//           setMensajeAlerta("Cuenta creada con exito.");
//           setTipoAlerta("success");
//           setDispatchAlerta(true);
//           setTimeout(() => {
//             setDispatchAlerta(false);
//           }, 3000);
//         } catch (error) {
//           console.log(error);
//           setIsLoading(false);
//           setMensajeAlerta("Error al crear usuario");
//           setTipoAlerta("error");
//           setDispatchAlerta(true);
//           setTimeout(() => {
//             setDispatchAlerta(false);
//           }, 3000);
//         }

//         navigate("/");
//         setIsLoading(false);
//       } catch (error) {
//         console.log(error.code);
//         switch (error.code) {
//           case "auth/email-already-in-use":
//             setMensajeAlerta("Ya existe una cuenta con este email.");
//             setTipoAlerta("error");
//             setDispatchAlerta(true);
//             setTimeout(() => {
//               setDispatchAlerta(false);
//             }, 3000);
//             break;
//           case "auth/weak-password":
//             setMensajeAlerta("La contraseña debe tener mas de 6 caracteres.");
//             setTipoAlerta("error");
//             setDispatchAlerta(true);
//             setTimeout(() => {
//               setDispatchAlerta(false);
//             }, 3000);
//             break;
//           case "auth/invalid-email":
//             setMensajeAlerta("Correo no valido");
//             setTipoAlerta("error");
//             setDispatchAlerta(true);
//             setTimeout(() => {
//               setDispatchAlerta(false);
//             }, 3000);
//             break;
//           default:
//             setMensajeAlerta("Error con la base de datos");
//             setTipoAlerta("error");
//             setDispatchAlerta(true);
//             setTimeout(() => {
//               setDispatchAlerta(false);
//             }, 3000);
//             break;
//         }
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       {!home ? <Header titulo={"Registrarse"} /> : null}
//       <Contenedor>
//         {/* <BotonQuery
//             datos={datos}
//         /> */}
//         <CajaTitulo>
//           <TituloMain>Registrarse</TituloMain>
//         </CajaTitulo>
//         <form onSubmit={() => handleInput()}>
//           <CajaInput>
//             <CajaInternaInput>
//               <Input
//                 type="email"
//                 name="correo"
//                 value={datosInput.correo}
//                 onChange={(e) => handleInput(e)}
//                 placeholder="Correo"
//                 autoComplete="off"
//               />
//             </CajaInternaInput>
//           </CajaInput>

//           <CajaInput>
//             <CajaInternaInput>
//               <Input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={datosInput.password}
//                 onChange={(e) => handleInput(e)}
//                 placeholder="Contraseña"
//                 autoComplete="off"
//               />
//               <CajaEye>
//                 <Icono
//                   icon={showPassword ? faEyeSlash : faEye}
//                   onClick={() => setShowPassword(!showPassword)}
//                 />
//               </CajaEye>
//             </CajaInternaInput>
//           </CajaInput>
//           <CajaInput>
//             <CajaInternaInput>
//               <Input
//                 name="repetirPassword"
//                 type={showPassword2 ? "text" : "password"}
//                 value={datosInput.repetirPassword}
//                 onChange={(e) => handleInput(e)}
//                 placeholder="Repetir contraseña"
//                 autoComplete="off"
//               />
//               <CajaEye>
//                 <Icono
//                   icon={showPassword2 ? faEyeSlash : faEye}
//                   onClick={() => setShowPassword2(!showPassword2)}
//                 />
//               </CajaEye>
//             </CajaInternaInput>
//           </CajaInput>

//           <CajaTitulo className="cajaBoton">
//             <BtnGeneralButton onClick={(e) => handleSubmit(e)} tipe="submit">
//               Aceptar
//             </BtnGeneralButton>
//           </CajaTitulo>
//         </form>
//         <Alerta
//           estadoAlerta={dispatchAlerta}
//           tipo={tipoAlerta}
//           mensaje={mensajeAlerta}
//         />
//       </Contenedor>
//       {isLoading ? <ModalLoading completa={true} /> : ""}
//     </>
//   );
// };

// const CajaTitulo = styled.div`
//   display: flex;
//   justify-content: center;
//   border-bottom: 2px solid ${Tema.primary.azulBrillante};
//   margin-bottom: 45px;
//   &.cajaBoton {
//     margin-top: 60px;
//   }
// `;

// const TituloMain = styled.h2`
//   color: white;
//   margin: auto;
// `;

// const Contenedor = styled.div`
//   height: 500px;
//   margin: auto;
//   padding: 25px;
//   width: 90%;
//   border: 1px solid black;
//   border-radius: 10px;
//   /* margin-top: 30px; */
//   background-color: ${Tema.secondary.azulProfundo};
//   padding-top: 60px;
//   border: 1px solid ${Tema.primary.azulBrillante};
// `;
// const CajaInput = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-bottom: 20px;
// `;
// const CajaInternaInput = styled.div`
//   width: 350px;
//   display: flex;
//   position: relative;
//   @media screen and (max-width: 500px) {
//     width: 90%;
//   }
// `;
// const Input = styled.input`
//   height: 30px;
//   outline: none;
//   background-color: transparent;
//   border: none;
//   border-bottom: 2px solid ${Tema.primary.azulBrillante};
//   color: ${Tema.primary.azulBrillante};
//   padding: 10px;
//   width: 100%;

//   &.fijado {
//     background-color: ${Tema.primary.grisNatural};
//     color: black;
//   }
//   @media screen and (max-width: 360px) {
//     width: 90%;
//   }
// `;

// const CajaEye = styled.div`
//   width: 10%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: absolute;
//   right: 0;
// `;

// const Icono = styled(FontAwesomeIcon)`
//   color: ${Tema.primary.azulBrillante};
//   cursor: pointer;
// `;
