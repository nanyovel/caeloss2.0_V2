import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Theme } from "../../config/theme";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { InputSimpleEditable } from "../../components/InputGeneral";
import {
  ContainerSeccion,
  TituloSeccion,
  WrapSeccion,
} from "../../components/JSXElements/SimpleElement";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import { BotonQuery } from "../../components/BotonQuery";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { Alerta } from "../../components/Alerta";
import { ModalLoading } from "../../components/ModalLoading";
import { ES6AFormat } from "../../libs/FechaFormat";
import { addDoc, collection } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

export default function Add({ userMaster }) {
  // ********** RECURSOS GENERALES **********
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // **************MANEJANDO FOTO DEl EQUIPO**************
  const inputRef = useRef(null);

  const clickFromIcon = () => {
    inputRef.current.click();
  };
  const [fileFotoAsset, setFileFotoAsset] = useState(null);
  const [urlLocalFotoAsset, setUrlLocalFotoAsset] = useState(null);
  useEffect(() => {
    setUrlLocalFotoAsset("");
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUrlLocalFotoAsset(imgUrl);
      setFileFotoAsset(file);
    }
  };

  // **************MANEJANDO LOS INPUTS**************
  const initialValue = {
    numeroDoc: "",
    estadoDoc: 0,
    descripcion: "",
    localidad: "",
    periodoMantenimiento: {
      kilometros: "",
      dias: "",
      horas: "",
    },
    tipoDeActivo: "",
    marca: "",
    referenciaTamannio: "",
    annioFabricacion: "",
    color: "",
    matricula: "",
    chasis: "",
    capacidadMaximaCarga: "",
    cargaRecomendada: "",
    serie: "",
    combustible: "",
    rendimiento: "",
    areaDeServicio: "",
    //
    ultimoMP: "",
    proximoMP: "",
    historicoMantenimientos: [],
  };
  const [inputValue, setInputValue] = useState({ ...initialValue });
  const handleInput = (e) => {
    const { value, name } = e.target;
    const datasetPropiedad = e.target.dataset.propiedad;
    console.log(datasetPropiedad);
    console.log(name);
    console.log(value);
    if (datasetPropiedad) {
      setInputValue((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          [datasetPropiedad]: value,
        },
      }));
    } else {
      setInputValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // *************** Enviar doc a la base de datos ***************
  const enviarDoc = async () => {
    if (inputValue.numeroDoc == "") {
      setMensajeAlerta("Es obligatorio colocar un identificador unico.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    try {
      setIsLoading(true);
      const romo = {
        ...inputValue,
        createAt: ES6AFormat(new Date()),
        createdBy: userMaster.id,
      };
      console.log(romo);
      await addDoc(collection(db, "equipos"), {
        ...inputValue,
        createAt: ES6AFormat(new Date()),
        createdBy: userMaster.id,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <BotonQuery inputValue={inputValue} />
      <SeccionFoto>
        <CajaFoto>
          <FotoAsset src={urlLocalFotoAsset} />
          {true && (
            <>
              <CajaIcono>
                <IconoFoto
                  onClick={clickFromIcon}
                  icon={faCloudArrowUp}
                  title="Cargar foto del activo."
                />
                <Parrafo className="fotoAsset">Foto del activo</Parrafo>
              </CajaIcono>
              <Input
                type="file"
                ref={inputRef}
                accept="image/*"
                onChange={handleFile}
                className="none"
              />
            </>
          )}
        </CajaFoto>
      </SeccionFoto>
      <WrapSeccion>
        <TituloSeccion>Datos del activo</TituloSeccion>
        <ContainerSeccion>
          <CajaInterna>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Codigo</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.numeroDoc}
                  name="numeroDoc"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Descripcion</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.descripcion}
                  name="descripcion"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>

            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Localidad</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.localidad}
                  name="localidad"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>

            <Detalle1Wrap2 className="vertical">
              <Detalle2Titulo className="vertical">
                Periodo de mantenimiento:
              </Detalle2Titulo>
              <Detalle3OutPut>
                <div>
                  <Detalle3OutPut className="vertical">
                    Cantidad de kilometros
                  </Detalle3OutPut>
                  <Input
                    value={inputValue.periodoMantenimiento.kilometros}
                    data-propiedad="kilometros"
                    autoComplete="off"
                    name="periodoMantenimiento"
                    onChange={(e) => handleInput(e)}
                  />
                </div>
                <div>
                  <Detalle3OutPut className="vertical">
                    Cantidad de dias
                  </Detalle3OutPut>
                  <Input
                    value={inputValue.periodoMantenimiento.dias}
                    data-propiedad="dias"
                    autoComplete="off"
                    name="periodoMantenimiento"
                    onChange={(e) => handleInput(e)}
                  />
                </div>
                <div>
                  <Detalle3OutPut className="vertical">
                    Cantidad de horas
                  </Detalle3OutPut>
                  <Input
                    value={inputValue.periodoMantenimiento.horas}
                    data-propiedad="horas"
                    autoComplete="off"
                    name="periodoMantenimiento"
                    onChange={(e) => handleInput(e)}
                  />
                </div>
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Tipo de activo:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.tipoDeActivo}
                  name="tipoDeActivo"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Marca:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.marca}
                  name="marca"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
          </CajaInterna>

          <CajaInterna>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Referencia tamaño:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.referenciaTamannio}
                  name="referenciaTamannio"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Año fabricacion:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.annioFabricacion}
                  name="annioFabricacion"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Color:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.color}
                  name="color"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Matricula:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.matricula}
                  name="matricula"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Chasis</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.chasis}
                  name="chasis"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Carga recomendada:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.cargaRecomendada}
                  name="cargaRecomendada"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Capacidad de carga:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.capacidadMaximaCarga}
                  name="capacidadMaximaCarga"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Serie:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.serie}
                  name="serie"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Combustible:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.combustible}
                  name="combustible"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Rendimiento:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.rendimiento}
                  name="rendimiento"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
            <Detalle1Wrap2 className="input">
              <Detalle2Titulo>Area der servicio:</Detalle2Titulo>
              <Detalle3OutPut className="input">
                <Input
                  value={inputValue.areaDeServicio}
                  name="areaDeServicio"
                  autoComplete="off"
                  onChange={(e) => handleInput(e)}
                />
              </Detalle3OutPut>
            </Detalle1Wrap2>
          </CajaInterna>
        </ContainerSeccion>
      </WrapSeccion>
      <BtnGeneralButton className="enviar" onClick={() => enviarDoc()}>
        Enviar
      </BtnGeneralButton>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Container>
  );
}
const Container = styled.div`
  min-height: 200px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SeccionFoto = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;
const CajaFoto = styled.div`
  position: relative;
`;
const FotoAsset = styled.img`
  border-radius: 50%;
  border: 4px solid ${Theme.primary.azulBrillante};
  height: 200px;
  width: 200px;
  object-fit: contain;
`;
const CajaIcono = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Parrafo = styled.p`
  width: 100%;

  &.fotoAsset {
    color: ${Theme.complementary.warning};
    background-color: ${Theme.primary.grisNatural};
    text-decoration: underline;
  }
`;
const Input = styled(InputSimpleEditable)`
  &.none {
    display: none;
  }
`;
const IconoFoto = styled(FontAwesomeIcon)`
  font-size: 2rem;
  border: 1px solid ${Theme.primary.azulBrillante};
  padding: 4px;
  cursor: pointer;
  transition: ease all 0.2s;
  background-color: ${Theme.primary.grisNatural};
  &:hover {
    border-radius: 4px;
    color: ${Theme.primary.azulBrillante};
  }
`;
const CajaInterna = styled.div`
  width: 50%;
  /* border: 1px solid red; */
  padding: 8px;
`;
const Detalle1Wrap2 = styled(Detalle1Wrap)`
  &:hover {
    background-color: transparent;
    color: white;
  }
`;
