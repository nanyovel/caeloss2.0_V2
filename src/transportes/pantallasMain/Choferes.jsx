import { useState, useEffect } from "react";
import styled from "styled-components";
import { ControlesTablas } from "../components/ControlesTablas.jsx";
import { CardReq } from "../components/CardReq.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { CardChofer } from "../components/CardChofer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

import { useDocByCondition } from "../../libs/useDocByCondition.js";
import AccionadorChoferes from "../components/AccionadorChoferes.jsx";
import { localidadesAlmacen } from "../../components/corporativo/Corporativo.js";
import {
  StyleTextStateDriver,
  StyleTextTypeDriver,
} from "../libs/DiccionarioNumberString.js";

export const Choferes = ({
  userMaster,
  dbTransferRequest,
  dbUsuarios,
  dbChoferes,
  setDBChoferes,
}) => {
  // ***************** UseEffect Inicial *****************
  const [dbChoferesAux, setDBChoferesAux] = useState([]);
  const [listaChoferes, setListaChoferes] = useState(null);
  const [listaChoferesInitial, setListaChoferesInitial] = useState([]);
  const [listaChoferesActivos, setListaChoferesActivos] = useState([]);
  const [datosParseados, setDatosParseados] = useState(false);

  useEffect(() => {
    const listaChofereAux = dbChoferesAux;

    listaChofereAux.sort(
      (a, b) => a.current.numeroCarga - b.current.numeroCarga
    );

    setListaChoferes(listaChofereAux);
    setListaChoferesInitial(listaChofereAux);
    setListaChoferesActivos(listaChofereAux);

    // Este codigo es para que si el usuario coloco algun filtro, y otro usuario afecta la base de datos, pues en la cargada inicial estara de acuerdo a los filtros
    let eventoAux = {
      target: {
        name: "null",
        value: "null",
      },
    };
    handleFiltros(eventoAux, listaChofereAux);
  }, [dbChoferesAux, dbChoferes]);

  useDocByCondition("choferes", setDBChoferesAux);
    useEffect(()=>{
console.log(dbChoferesAux)
  },[dbChoferesAux])

  // ***************** ACCIONADOR ********************
  const [hasAccion, setHasAccion] = useState(false);

  const [propsAccion, setPropsAccion] = useState({
    idDoc: "",
    titulo: "Organizador de lista",
    todosDisponible: false,
  });

  const accionar = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name == "btnOrganizar") {
      const hasPermiso = userMaster.permisos.includes("sortDriver");
      if (!hasPermiso) {
        return;
      }
      setHasAccion(true);
    }
  };
  const handleControles = (e) => {
    const { name, value } = e.target;
    accionar(e);
    console.log(name);
  };
  // ********************* CONTROLES // FILTROS ************************
  const [valueSearch, setValueSearch] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [valueTipo, setValueTipo] = useState("");
  const [valueLocalidad, setValueLocalidad] = useState("");

  const handleFiltros = (e, arrayReset) => {
    let name = "";
    let value = "";
    if (e) {
      name = e.target.name;
      value = e.target.value;
    }

    let arrayAux = arrayReset ? arrayReset : listaChoferesInitial;
    let entradaMaster = value.toLowerCase();

    if (name == "valueSearch") {
      setValueSearch(value);
    } else if (name == "valueStatus") {
      setValueStatus(entradaMaster);
    } else if (name == "valueTipo") {
      setValueTipo(entradaMaster);
    } else if (name == "valueLocalidad") {
      setValueLocalidad(entradaMaster);
    }

    const filtroSeach = () => {
      //
      // filtros solicitud
      //
      //
      //
      //
      //
      let entradaUsar = entradaMaster;

      if (name == "valueSearch") {
        if (entradaUsar == "") {
          return "";
        }
      } else {
        entradaUsar = valueSearch;
      }
      const nuevoArray = arrayAux.filter((chofer) => {
        let incluir = false;

        // Nombre solicitante

        // ******* SI EL CHOFER ESTA LLEVANDO ALGUNA SOLICITUD *******
        // datos current solicitud filtrar chofer
        // numero solicitud
        // nombre y apellido solicitante
        // departamenteo solicitante
        // socio negocio
        // personas de contacto
        // numero proyecto
        // numeros de documentos
        // detalles

        // municio destino
        // provincia destino
        console.log(chofer);
        if (chofer.current.solicitud.numeroDoc) {
          const nombreCompletoRequester =
            chofer.current.solicitud.datosSolicitante?.nombre +
            " " +
            chofer.current.solicitud.datosSolicitante?.apellido;

          // Documentos
          chofer.current.solicitud?.datosReq?.documentos.forEach((doc) => {
            if (doc.numeroDoc.toLowerCase().includes(entradaUsar)) {
              incluir = true;
            }
          });
          // Personas de contacto
          chofer?.current?.solicitud?.datosReq?.personasContacto?.forEach(
            (contact) => {
              if (
                contact.nombre.toLowerCase().includes(entradaUsar) ||
                contact.telefono.toLowerCase().includes(entradaUsar) ||
                contact.rol.toLowerCase().includes(entradaUsar)
              ) {
                incluir = true;
              }
            }
          );

          if (chofer.current.solicitud.numeroDoc) {
            if (
              nombreCompletoRequester.toLowerCase().includes(entradaUsar) ||
              chofer.current.solicitud.numeroDoc
                .toString()
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosReq.socioNegocio
                .toString()
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosFlete?.destinoSeleccionado?.municipioSeleccionado?.label
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosFlete?.destinoSeleccionado?.label
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosReq.detalles
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosReq.numeroProyecto
                .toLowerCase()
                .includes(entradaUsar) ||
              chofer.current.solicitud.datosSolicitante.dpto
                .toLowerCase()
                .includes(entradaUsar)
            ) {
              return chofer;
            }
          }
        }

        // datos estaticos filtrar del chofer
        // nombre
        // apellido
        // codigo
        // placa
        // calular
        // flota
        // cedula
        // Nombre chofer
        const nombreCompleto = chofer.nombre + " " + chofer.apellido;
        if (
          nombreCompleto.toLowerCase().includes(entradaUsar) ||
          chofer.cedula.toLowerCase().includes(entradaUsar) ||
          chofer.numeroDoc.toLowerCase().includes(entradaUsar) ||
          chofer.unidadVehicular.placa.toLowerCase().includes(entradaUsar) ||
          chofer.unidadVehicular.descripcion
            .toLowerCase()
            .includes(entradaUsar) ||
          chofer.celular.toString().toLowerCase().includes(entradaUsar) ||
          chofer.flota.toString().toLowerCase().includes(entradaUsar)
        ) {
          return chofer;
        }

        if (incluir == true) {
          return chofer;
        }
      });
      arrayAux = nuevoArray;
    };
    const filtroStatus = () => {
      let entradaUsar = entradaMaster;
      console.log(entradaMaster);
      if (name != "valueStatus") {
        entradaUsar = valueStatus;
      }

      let valorDefault = false;
      if (entradaUsar == "todos" || entradaUsar == "") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }
      const arrayNuevo = arrayAux.filter((chofer) => {
        if (valorDefault) {
          return chofer;
        } else {
          const opcionSelect = StyleTextStateDriver.find(
            (opcion) => opcion.numero == chofer.estadoDoc
          );
          console.log(entradaUsar);
          if (opcionSelect) {
            const codigoMinus = opcionSelect.codigo.toLowerCase();
            if (codigoMinus == entradaUsar) {
              return chofer;
            }
          }
        }
      });
      arrayAux = arrayNuevo;
    };
    const filtroTipo = () => {
      let entradaUsar = entradaMaster;
      if (name != "valueTipo") {
        entradaUsar = valueTipo;
      }

      let valorDefault = false;
      if (entradaUsar == "todos" || entradaUsar == "") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }

      const arrayNuevo = arrayAux.filter((chofer) => {
        if (valorDefault) {
          return chofer;
        } else {
          const opcionSelect = StyleTextTypeDriver.find(
            (opcion) => opcion.numero == chofer.tipo
          );
          if (opcionSelect) {
            const codigoMinus = opcionSelect.codigo.toLowerCase();
            console.log(codigoMinus);
            console.log(entradaUsar);
            if (codigoMinus == entradaUsar) {
              return chofer;
            }
          }
        }
      });
      arrayAux = arrayNuevo;
    };
    const filtroLocalidad = () => {
      console.log(entradaMaster);
      let entradaUsar = entradaMaster;
      if (name != "valueLocalidad") {
        entradaUsar = valueLocalidad;
      }

      let valorDefault = false;
      if (entradaUsar == "todos" || entradaUsar == "") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }

      const arrayNuevo = arrayAux.filter((chofer) => {
        if (valorDefault) {
          return chofer;
        } else {
          console.log(chofer.localidad);
          console.log(entradaUsar);
          if (chofer.localidad.toLowerCase() == entradaUsar.toLowerCase()) {
            return chofer;
          }
        }
      });
      arrayAux = arrayNuevo;
    };

    filtroSeach();
    filtroStatus();
    filtroTipo();
    filtroLocalidad();
    setListaChoferes([...arrayAux]);
  };
  const initialControles = {
    search: {
      nombre: "Buscar",
      name: "valueSearch",
      active: true,
    },
    menuDesplegable: [
      {
        nombre: "Status",
        name: "valueStatus",
        active: true,
        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: true,
          },
          ...StyleTextStateDriver.map((option, index) => ({
            ...option,
            opcion: option.codigo,
            descripcion: option.texto,
            select: false,
          })),
          // {
          //   opcion: "off",
          //   descripcion: "OFF",
          //   select: false,
          // },
          // {
          //   opcion: "disponible",
          //   descripcion: "Disponible",
          //   select: false,
          // },
          // {
          //   opcion: "ejecucion",
          //   descripcion: "Ejecucion",
          //   select: false,
          // },
          // {
          //   opcion: "inactivo",
          //   descripcion: "Inactivos",
          //   select: false,
          // },
        ],
      },
      {
        nombre: "Tipo",
        active: true,
        disabled: false,
        name: "valueTipo",
        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: true,
          },
          {
            opcion: "IN",
            descripcion: "IN - Interno",
            select: false,
          },
          {
            opcion: "EI",
            descripcion: "EI - Externo Indep.",
            select: false,
          },
          {
            opcion: "EE",
            descripcion: "EE - Externo Empresa",
            select: false,
          },
        ],
      },
      {
        nombre: "Localidad",
        active: true,
        disabled: false,
        name: "valueLocalidad",

        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: true,
          },
          ...localidadesAlmacen.map((loc) => ({
            ...loc,
            stringValue: true,
            // descripcion: loc.nombreSucursalOrigen,
          })),
        ],
      },
    ],

    btns: [{ texto: "Organizar", tipo: "btnOrganizar", funcion: accionar }],
  };
  const [controles, setControles] = useState(null);
  useEffect(() => {
    if (listaChoferes) {
      const canSort = userMaster.permisos.includes("sortDriver");

      const controlesPriv = {
        ...initialControles,
        btns: initialControles.btns.filter((boton) => {
          if (boton.tipo == "btnOrganizar") {
            if (canSort) {
              return boton;
            }
          } else {
            return boton;
          }
        }),
      };
      console.log(controlesPriv);
      setControles(controlesPriv);
      setDatosParseados(true);
    }
  }, [listaChoferes]);

  return (
    datosParseados && (
      <>
        <BotonQuery
          listaChoferes={listaChoferes}
          listaChoferesInitial={listaChoferesInitial}
        />
        <ContainerControles>
          <ControlesTablas
            titulo=" Lista de choferes activos"
            controles={controles}
            handleFiltros={handleFiltros}
            handleControles={handleControles}
            valueSearch={valueSearch}
            valueStatus={valueStatus}
            valueTipo={valueTipo}
            valueLocalidad={valueLocalidad}
            tipo={"reqTransport"}
          />
        </ContainerControles>
        {hasAccion && (
          <AccionadorChoferes
            propsAccion={propsAccion}
            accionar={accionar}
            listaChoferes={listaChoferesActivos}
            setHasAccion={setHasAccion}
            setPropsAccion={setPropsAccion}
            userMaster={userMaster}
          ></AccionadorChoferes>
        )}
        <ContainerCard>
          {listaChoferes.length > 0 &&
            listaChoferes?.map((chofer, index) => {
              return (
                <CardChofer
                  key={index}
                  chofer={chofer}
                  numero={index}
                  // listaChoferes={listaChoferes}
                  // dbUsuarios={dbUsuarios}
                  // dbTransferRequest={dbTransferRequest}
                  // userMaster={userMaster}
                  // handleFiltros={handleFiltros}
                />
              );
            })}
        </ContainerCard>
      </>
    )
  );
};
const ContainerControles = styled.div`
  margin-bottom: 5px;
`;
const ContainerCard = styled.div`
  padding: 0 10px;
`;
