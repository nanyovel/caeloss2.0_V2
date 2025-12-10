import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ControlesTablas } from "../components/ControlesTablas";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { useDocByCondition } from "../../libs/useDocByCondition";
import { BotonQuery } from "../../components/BotonQuery";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import Table from "../../components/JSXElements/Tablas/Table";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import ModalGeneral from "../../components/ModalGeneral";

export const Proyectos = () => {
  // ***************** UseEffect Inicial *****************
  const [dbProyectos, setDBProyectos] = useState([]);
  const [listaProyectos, setListaProyectos] = useState([]);
  const [listaProyectosInitial, setListaProyectosInitial] = useState([]);

  useDocByCondition("proyectos", setDBProyectos, "estadoDoc", "==", 0);

  useEffect(() => {
    const listaProyectosAux = dbProyectos;
    setListaProyectos(listaProyectosAux);
    setListaProyectosInitial(listaProyectosAux);

    // Este codigo es para que si el usuario coloco algun filtro, y otro usuario afecta la base de datos, pues en la cargada inicial estara de acuerdo a los filtros
    let eventoAux = {
      target: {
        name: "null",
        value: "null",
      },
    };
    // handleFiltros(eventoAux, listaProyectosAux);
  }, [dbProyectos]);

  // ***************** CODIGO PARA EL MODAL DE CONTACTOS *****************
  //   Parsear datos tabla modal contactos
  const [datosModal, setDatosModal] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);

  const hashModa = (e, index) => {
    setMostrarModal(true);
    const findedProyecto = listaProyectos.find((proy, i) => {
      if (index == i) {
        return proy;
      }
    });
    setDatosModal({ ...findedProyecto });
  };

  // ********************* CONTROLES // FILTROS ************************
  const [valueSearch, setValueSearch] = useState("");
  const handleFiltros = (e, arrayReset) => {
    let name = "";
    let value = "";
    if (e) {
      name = e.target.name;
      value = e.target.value;
    }

    let arrayAux = arrayReset ? arrayReset : listaProyectosInitial;
    let entradaMaster = value.toLowerCase();

    if (name == "valueSearch") {
      setValueSearch(value);
    }

    const filtroSeach = () => {
      // numero
      // socioNegocio
      // detalle
      // personas de contacto
      let entradaUsar = entradaMaster;

      if (name == "valueSearch") {
        if (entradaUsar == "") {
          return "";
        }
      } else {
        entradaUsar = valueSearch;
      }
      const nuevoArray = arrayAux.filter((proy) => {
        let incluir = false;

        // Personas de contacto
        proy.personasContacto.forEach((person) => {
          if (
            person.nombre.toLowerCase().includes(entradaUsar) ||
            person.rol.toLowerCase().includes(entradaUsar) ||
            person.telefono.toLowerCase().includes(entradaUsar)
          ) {
            incluir = true;
          }
        });

        if (
          proy.numeroDoc.toLowerCase().includes(entradaUsar) ||
          proy.socioNegocio.toLowerCase().includes(entradaUsar) ||
          proy.detalles.toLowerCase().includes(entradaUsar) ||
          incluir == true
        ) {
          return proy;
        }
      });
      arrayAux = nuevoArray;
    };

    filtroSeach();
    setListaProyectos([...arrayAux]);
  };

  const [controles, setControles] = useState({
    search: {
      nombre: "Buscar",
      name: "valueSearch",
      active: true,
    },
  });

  const [columnasTable, setColumnasTable] = useState([]);
  const [datosTablaState, setDatosTablaState] = useState([]);
  useEffect(() => {
    // Definimos las columnas
    const columnasTabla = [
      { label: "Numero*", key: "numeroDoc" },
      { label: "Cliente", key: "socioNegocio" },
      { label: "Detalles", key: "detalles" },
      { label: "Location*", key: "location" },
      { label: "Contactos*", key: "personasContacto" },
    ];

    setColumnasTable(columnasTabla);

    // Parsear los datos
    const datosTablas = listaProyectos.map((item, index) => {
      return {
        ...item,
      };
    });
    const datosParsedTabla = datosTablas.map((obj, index) =>
      Object.entries(obj).map(([key, value]) => {
        console.log(key);
        return {
          value:
            key == "personasContacto" ? (
              <BtnEmoji
                className="clicKeable"
                onClick={(e) => hashModa(e, index)}
              >
                👁️
              </BtnEmoji>
            ) : key == "location" ? (
              <Enlaces target="_blank" to={value}>
                Ver Location
              </Enlaces>
            ) : (
              value
            ),
          key,
        };
      })
    );

    setDatosTablaState(datosParsedTabla);
  }, [listaProyectos]);

  return (
    <Container>
      <BotonQuery listaProyectos={listaProyectos} />
      <ContainerControles>
        <ControlesTablas
          titulo=" Lista de proyectos activos"
          controles={controles}
          handleFiltros={handleFiltros}
          valueSearch={valueSearch}
          tipo={"proyestos"}
        />
      </ContainerControles>
      {true && (
        <CajaTabla2>
          <Tabla2>
            <thead>
              <Filas2 className="cabeza">
                <CeldaHead2>N°</CeldaHead2>
                <CeldaHead2>Numero*</CeldaHead2>
                <CeldaHead2>Cliente</CeldaHead2>
                <CeldaHead2>Detalles</CeldaHead2>
                <CeldaHead2>Location</CeldaHead2>
                <CeldaHead2>Contactos</CeldaHead2>
              </Filas2>
            </thead>
            <tbody>
              {listaProyectos.map((proy, index) => {
                return (
                  <Filas2
                    className={`body
                           ${index % 2 ? "impar" : "par"}
                    `}
                    key={index}
                  >
                    <CeldasBody2>{index + 1}</CeldasBody2>
                    <CeldasBody2>
                      <Enlaces
                        to={`/transportes/maestros/proyectos/${encodeURIComponent(proy.numeroDoc)}`}
                        target="_blank"
                      >
                        {proy.numeroDoc}
                      </Enlaces>
                    </CeldasBody2>
                    <CeldasBody2>{proy.socioNegocio}</CeldasBody2>
                    <CeldasBody2>{proy.detalles}</CeldasBody2>
                    <CeldasBody2>
                      <Enlaces target="_blank" to={proy.location}>
                        Ver Location
                      </Enlaces>
                    </CeldasBody2>
                    <CeldasBody2
                      className="clicKeable"
                      onClick={(e) => hashModa(e, index)}
                    >
                      👁️
                    </CeldasBody2>
                  </Filas2>
                );
              })}
            </tbody>
          </Tabla2>
        </CajaTabla2>
      )}
      {mostrarModal && (
        <ModalGeneral
          titulo={`Contactos del proyecto N°${datosModal.numeroDoc}`}
          setHasModal={setMostrarModal}
        >
          <TablaModal>
            <Tabla2>
              <thead>
                <Filas2 className={mostrarModal ? "cabeza modalH" : "cabeza"}>
                  <CeldaHeadModal>N°</CeldaHeadModal>
                  <CeldaHeadModal>Nombre*</CeldaHeadModal>
                  <CeldaHeadModal>Rol</CeldaHeadModal>
                  <CeldaHeadModal>Telefono</CeldaHeadModal>
                </Filas2>
              </thead>
              <tbody>
                {datosModal.personasContacto.length > 0 &&
                  datosModal.personasContacto.map((contact, index) => {
                    return (
                      <Filas2
                        key={index}
                        className={`body
                            ${mostrarModal ? " modalB" : "osca"}
                             ${index % 2 ? "impar" : "par"}
                            `}
                      >
                        <CeldasBodyModal>{index + 1}</CeldasBodyModal>
                        <CeldasBodyModal>{contact.nombre}</CeldasBodyModal>
                        <CeldasBodyModal>{contact.rol}</CeldasBodyModal>
                        <CeldasBodyModal>{contact.telefono}</CeldasBodyModal>
                      </Filas2>
                    );
                  })}
              </tbody>
            </Tabla2>
          </TablaModal>
        </ModalGeneral>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 300px;
`;
const ContainerControles = styled.div`
  margin-bottom: 5px;
`;

const CajaTabla2 = styled(CajaTablaGroup)`
  padding: 0 10px;
  overflow-x: scroll;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;

const Tabla2 = styled(TablaGroup)``;

const Filas2 = styled(FilasGroup)`
  &.modalH {
    background-color: ${Tema.secondary.azulGraciel};
  }
`;

const CeldaHead2 = styled(CeldaHeadGroup)``;
const CeldasBody2 = styled(CeldasBodyGroup)`
  &.clicKeable {
    cursor: pointer;
  }
  text-align: center;
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ContenedorModal = styled.div`
  background-color: #0000008b;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const ContainerTabla = styled.div`
  width: 80%;
  padding: 15px;
  border-radius: 5px;
  background-color: ${Tema.primary.azulOscuro};
  color: ${Tema.neutral.blancoHueso};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
    color: white;
  }
`;
const TablaModal = styled.div`
  min-width: 300px;
  min-height: 20px;
`;
const CajaTitulo = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TituloModal = styled.h2``;
const TextoX = styled.p`
  border: 1px solid black;
  cursor: pointer;
  transition: ease 0.2s;
  &:hover {
    border: 1px solid white;
    border-radius: 5px;
  }
`;
const BtnEmoji = styled.p`
  cursor: pointer;

  &:hover {
    border: 2px solid ${Theme.primary.azulBrillante};
  }
`;
const FilasModal = styled.tr`
  &.body {
    font-weight: normal;
    /* border-bottom: 1px solid #49444457; */
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }

  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  color: ${Tema.neutral.blancoHueso};
  &.inpar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
    /* background-color: #183f6e; */
    /* background-color: ${ClearTheme.secondary.azulSuave2}; */
  }
`;
const CeldaHeadModal = styled.th`
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border-left: #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
const CeldasBodyModal = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* border: 1px solid black; */
  height: 25px;
  text-align: center;
  &.par {
    border-left: 1px solid #e1eef4;
  }
`;
