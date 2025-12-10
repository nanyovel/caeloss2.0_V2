import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../config/theme";
import { Detalle1Wrap, Detalle2Titulo } from "./JSXElements/GrupoDetalle";
import { InputSimpleEditable } from "./InputGeneral";
import { BtnGeneralButton } from "./BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "./JSXElements/GrupoTabla";
import { BotonQuery } from "./BotonQuery";

export function DocumentosAdjunto({
  //   Nueva
  archivosAdjuntoLocal,
  setArchivosAdjuntoLocal,
  archivosAdjuntoDB,
  setArchivosAdjuntoDB,
  TIPO,
  guardarCambiosDocAdj,
  limpiarDatosAdjuntos,
  userMaster,
  //
}) {
  //
  const inputRef = useRef(null);
  const clickFromIcon = () => {
    const hasPermiso = userMaster?.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    inputRef.current.click();
  };

  const handleFile = (e) => {
    const hasPermiso = userMaster?.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    // const files = e.target.files;
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setArchivosAdjuntoLocal([...archivosAdjuntoLocal, ...files]);
    }
  };

  // Esta funcion quita archivos de los que ya existen en la base de datos,
  // Pero realmente le agrega una propiedad de eliminado, para luego que el usuario presiona guarda
  // Entonces se guardan los cambios y se elimina oficialmente de la base de datos de un solo click todos los
  // Todos los archivos a eliminar
  const quitarArchivoLocamenteDB = (e) => {
    const hasPermiso = userMaster?.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    const ruta = e.target.dataset.ruta;
    console.log(ruta);
    setArchivosAdjuntoDB(
      archivosAdjuntoDB.map((file, index) => {
        console.log(file);
        return {
          ...file,
          eliminado: file.rutaStorage == ruta ? true : file.eliminado,
        };
      })
    );
  };
  const quitarArchivoLocal = (e) => {
    const hasPermiso = userMaster?.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    const indexDataset = Number(e.target.dataset.index);
    console.log(indexDataset);
    setArchivosAdjuntoLocal(
      archivosAdjuntoLocal.filter((file, index) => index != indexDataset)
    );
  };

  return (
    <Contenedor>
      <BotonQuery
        archivosAdjuntoDB={archivosAdjuntoDB}
        archivosAdjuntoLocal={archivosAdjuntoLocal}
        userMaster={userMaster}
      />
      {true && (
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                {userMaster?.permisos.includes("managerAttachIMS") && (
                  <CeldaHeadGroup>Eliminar</CeldaHeadGroup>
                )}
              </FilasGroup>
            </thead>
            <tbody>
              {/* Estos son los archivos desde la base de datos */}
              {archivosAdjuntoDB
                ?.filter((file) => file.eliminado == false)

                .map((file, index) => {
                  return (
                    <FilasGroup key={index} className={`body`}>
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        <Enlace target="_blank" to={file.url}>
                          {file.nombre}
                        </Enlace>
                      </CeldasBodyGroup>
                      {userMaster?.permisos.includes("managerAttachIMS") && (
                        <CeldasBodyGroup className="startText">
                          <ParrafoAction
                            data-ruta={file.rutaStorage}
                            onClick={(e) => quitarArchivoLocamenteDB(e)}
                          >
                            ❌
                          </ParrafoAction>
                        </CeldasBodyGroup>
                      )}
                    </FilasGroup>
                  );
                })}
              <FilasGroup className="body">
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
              </FilasGroup>
              <FilasGroup className="body">
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
              </FilasGroup>
              <FilasGroup className="body">
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
              </FilasGroup>
              <FilasGroup className="body">
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
              </FilasGroup>
              <FilasGroup className="body">
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
                <CeldasBodyGroup className="startText"></CeldasBodyGroup>
              </FilasGroup>

              {/* Estos son archivos que se van agregando en local para luego subir a la base de datos */}
              {archivosAdjuntoLocal?.map((file, index) => {
                return (
                  <FilasGroup key={index} className={`body warning`}>
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup className="startText">
                      <Enlace target="_blank" to={URL.createObjectURL(file)}>
                        {file.name}
                      </Enlace>
                    </CeldasBodyGroup>

                    {userMaster?.permisos.includes("managerAttachIMS") && (
                      <CeldasBodyGroup className="startText">
                        <ParrafoAction
                          data-index={index}
                          onClick={(e) => quitarArchivoLocal(e, file)}
                        >
                          ❌
                        </ParrafoAction>
                      </CeldasBodyGroup>
                    )}
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
        </CajaTablaGroup>
      )}
      {false &&
        archivosAdjuntoLocal.map((file, index) => {
          return (
            <WrapArchivo key={index}>
              <Ancla target="_blank" href={URL.createObjectURL(file)}>
                {/* {URL.createObjectURL(file)} */}
                {file.name}
              </Ancla>
              <CajaInterna
                className="der"
                data-index={index}
                onClick={(e) => quitarArchivoLocal(e, file)}
              >
                ❌
              </CajaInterna>
            </WrapArchivo>
          );
        })}
      {userMaster?.permisos.includes("managerAttachIMS") && (
        <CajaBtn className="cajaBtn">
          <BtnSimple
            name="add"
            onClick={() => clickFromIcon()}
            data-action="add"
          >
            +
          </BtnSimple>
          <Input
            type="file"
            ref={inputRef}
            multiple
            accept="image/*,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.ms-powerpoint,
          application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFile}
            className="none"
          />

          {TIPO == "edicionBL" && (
            <>
              <BtnSimple onClick={() => guardarCambiosDocAdj()}>
                Guardar
              </BtnSimple>
              <BtnSimple
                className="danger"
                onClick={() => limpiarDatosAdjuntos()}
              >
                Cancelar
              </BtnSimple>
            </>
          )}
        </CajaBtn>
      )}
    </Contenedor>
  );
}

const Contenedor = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
  gap: 8px;
`;

const CajaBtn = styled.div`
  display: flex;

  background-color: transparent;
  justify-content: center;
  height: 60px;
`;
const BtnSimple = styled(BtnGeneralButton)`
  min-width: 100px;

  width: 120px;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  height: 30px;
`;
const Input = styled.input`
  height: 30px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${Tema.primary.azulBrillante};
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  padding: 10px;
  width: 100%;
  &.none {
    display: none;
  }

  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  @media screen and (max-width: 360px) {
    width: 90%;
  }
`;

const WrapArchivo = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-bottom: 0;
  border-radius: 4px;
  border: 1px solid white;
  min-height: 45px;
  display: flex;
`;
const CajaInterna = styled.div`
  &.izq {
  }
  &.der {
    width: 20%;
    height: 100%;
    background-color: #ffffff;
    text-align: center;
    align-content: center;
    transition: ease 0.2s all;
    &:hover {
      background-color: #96a9b9;
      cursor: pointer;
    }
  }
`;
const Ancla = styled.a`
  color: white;
  width: 80%;
  height: 100%;
  background-color: #5c5c5c;
  transition: all 0.2s ease;
  align-content: center;
  padding: 4px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    background-color: #c0c0c0;
    color: black;
    border: 1px solid black;
  }
`;
