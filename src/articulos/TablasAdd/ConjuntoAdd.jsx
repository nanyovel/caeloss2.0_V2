import { useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  Detail1InputWrap,
  Detalle2Titulo,
} from "../../components/JSXElements/GrupoDetalle";
import { InputSimpleEditable, TextArea } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";
import MenuPestannias from "../../components/MenuPestannias";
import { conjuntoSchema } from "../schemas/conjuntoSchema";
import imgImagen from "./../img/imagen.png";
import imgVideo from "./../img/video.png";
import { BotonQuery } from "../../components/BotonQuery";
import { Alerta } from "../../components/Alerta";
import { imagenesVideosSchema } from "../schemas/mixtoSchema";
import { getYoutubeIdFromUrl } from "../../libs/generarIdYouTube";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ES6AFormat } from "../../libs/FechaFormat";
import { ModalLoading } from "../../components/ModalLoading";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toSlug } from "../../libs/StringParsed";

export default function ConjuntoAdd({ userMaster }) {
  const ListaArticulos = PRODUCT_FULL2;

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Individual",
      code: "individual",
      select: true,
    },
    {
      nombre: "Grupo",
      code: "grupo",
      select: false,
    },
  ]);
  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  const conjuntoInitial = {
    ...conjuntoSchema,
    observaciones: ["", "", ""],
    imagenes: [{ ...imagenesVideosSchema, URLLocalAux: "", fileAux: "" }],
    videos: [{ ...imagenesVideosSchema }],
  };
  const [conjuntoEditable, setConjuntoEditable] = useState({
    ...conjuntoInitial,
  });
  const initialInput = {
    codigo: "",
    descripcion: "",
  };
  const [articuloBuscar, setArticuloBuscar] = useState({
    ...initialInput,
  });
  const handleInputs = (e) => {
    const { name, value } = e.target;
    const indexDataset = e.target.dataset.index;
    const propiedadDataset = e.target.dataset.propiedad;
    if (propiedadDataset == "imagenes") {
      if (name == "archivo") {
        const file = e.target.files[0];
        if (file) {
          const imgUrl = URL.createObjectURL(file);

          setConjuntoEditable((preState) => ({
            ...preState,
            imagenes: preState.imagenes.map((img, index) => {
              if (index == indexDataset) {
                return {
                  ...img,
                  URLLocalAux: imgUrl,
                  fileAux: file,
                };
              } else {
                return { ...img };
              }
            }),
          }));
        }
      } else {
        setConjuntoEditable((preState) => ({
          ...preState,
          imagenes: preState.imagenes.map((img, index) => {
            return {
              ...img,
              [name]: index == indexDataset ? value : img[name],
            };
          }),
        }));
      }
    } else if (propiedadDataset == "videos") {
      if (name == "url") {
        setConjuntoEditable((preState) => ({
          ...preState,
          videos: preState.videos.map((video, index) => {
            return {
              ...video,
              url: index == indexDataset ? value : video.url,
            };
          }),
        }));
        // const urlFrame = getYoutubeIdFromUrl(value);
      } else {
        setConjuntoEditable((preState) => ({
          ...preState,
          videos: preState.videos.map((video, index) => {
            return {
              ...video,
              [name]: index == indexDataset ? value : video[name],
            };
          }),
        }));
      }
    } else {
      if (name == "codigoBuscar") {
        const articuloBuscado = ListaArticulos.find((item) => {
          if (item.codigo == value) {
            return item;
          }
        });

        setArticuloBuscar({
          ...articuloBuscar,
          codigo: value,
          descripcion: articuloBuscado ? articuloBuscado.descripcion : "",
        });
      } else if (name == "observaciones") {
        setConjuntoEditable((preState) => ({
          ...preState,
          observaciones: preState.observaciones.map((obs, index) => {
            return index == indexDataset ? value : obs;
          }),
        }));
      } else {
        setConjuntoEditable((preState) => ({
          ...preState,
          [name]: value,
        }));
      }
    }
  };

  const addObs = (e) => {
    setConjuntoEditable((prevState) => ({
      ...prevState,
      observaciones: [...prevState.observaciones, ""],
    }));
  };
  const removeLastObs = () => {
    setConjuntoEditable((prevState) => ({
      ...prevState,
      observaciones:
        prevState.observaciones.length > 1
          ? prevState.observaciones.slice(0, -1)
          : prevState.observaciones,
    }));
  };
  const addArticulo = () => {
    console.log(articuloBuscar);
    if (articuloBuscar.codigo == "") {
      setMensajeAlerta("Indicar producto agregar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    const existe = conjuntoEditable.items.find(
      (item) => item.codigo == articuloBuscar.codigo
    );
    if (existe) {
      setMensajeAlerta("Producto ya agregado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    } else {
      setConjuntoEditable((preState) => ({
        ...preState,
        items: [...preState.items, { ...articuloBuscar }],
      }));

      setArticuloBuscar({ ...initialInput });
    }
  };
  const removeArticulo = (e) => {
    const indexData = e.target.dataset.index;
    const listadoUp = conjuntoEditable.items.filter((item, index) => {
      if (index != indexData) {
        return item;
      }
    });

    setConjuntoEditable((prevState) => ({
      ...prevState,
      items: listadoUp,
    }));
  };
  const addImagen = (tipo) => {
    setConjuntoEditable((preState) => ({
      ...preState,
      [tipo]: [...preState[tipo], { ...imagenesVideosSchema }],
    }));
  };
  const removeImagen = (tipo) => {
    setConjuntoEditable((prevState) => ({
      ...prevState,
      [tipo]:
        prevState[tipo].length > 1
          ? prevState[tipo].slice(0, -1)
          : prevState[tipo],
    }));
  };

  // ************* ENVIAR A LA BASE DE DATOS ***********
  const enviarDatos = async () => {
    try {
      setIsLoading(true);
      const storage = getStorage();
      const batch = writeBatch(db);
      const collectionUp = collection(db, "conjuntos");
      const nuevoDocRef = doc(collectionUp);

      let imgConjuntoAux = conjuntoEditable.imagenes;

      const arrayImgAux = conjuntoEditable.imagenes.filter(
        (img) => img.fileAux
      );
      // for (const [index, img] of arrayImgAux.entries()) {
      //   const nombreFoto =
      //     "productos/conjuntos/" + img.fileAux.name + "_" + Date.now();
      //   const storageRefFoto = ref(storage, nombreFoto);

      //   await uploadBytes(storageRefFoto, img.fileAux).then(() => {});
      //   const urlStorage = await getDownloadURL(storageRefFoto);
      //   // arrayImgAux.push(())
      //   const imagenesUp = conjuntoEditable.imagenes.map((foto, i) => {
      //     if (i == index) {
      //       return {
      //         ...foto,
      //         url: urlStorage,
      //       };
      //     } else {
      //       return { ...foto };
      //     }
      //   });
      //   imgConjuntoAux = imagenesUp;
      // }

      const imagenesConUrl = await Promise.all(
        arrayImgAux.map(async (img) => {
          const nombreFoto =
            "productos/conjuntos/" + img.fileAux.name + "_" + Date.now();
          const storageRefFoto = ref(storage, nombreFoto);
          await uploadBytes(storageRefFoto, img.fileAux).then(() => {});
          const urlStorage = await getDownloadURL(storageRefFoto);
          return {
            ...img,
            url: urlStorage,
          };
        })
      );
      console.log(conjuntoEditable);
      console.log(imagenesConUrl);

      const arrayCodigoItems = conjuntoEditable.items.map(
        (item) => item.codigo
      );
      console.log(arrayCodigoItems);
      const catItems = arrayCodigoItems.map((item) => {
        const itemFind = PRODUCT_FULL2.find((mat) => mat.codigo == item);

        return {
          item,
          categoria: itemFind ? itemFind.categoria : "",
        };
      });
      console.log(catItems);
      const categoriasParsed = [
        ...new Set(catItems.map((item) => item.categoria)),
      ];
      const conjuntoUp = {
        ...conjuntoSchema,
        ...conjuntoEditable,
        noProyecto: conjuntoUp.noProyecto.toLowerCase(),
        arrayCodigoItems: arrayCodigoItems,
        observaciones: conjuntoEditable.observaciones.filter(
          (obs) => obs != ""
        ),
        url: toSlug(conjuntoEditable.titulo),
        imagenes: imagenesConUrl.map(({ URLLocalAux, fileAux, ...rest }) => {
          return {
            ...rest, // todas las props menos URLLocalAux y fileAux
          };
        }),
        categorias: categoriasParsed,
        //
        createdBy: userMaster.userName,
        createdAt: ES6AFormat(new Date()),
      };
      console.log(conjuntoUp);
      batch.set(nuevoDocRef, conjuntoUp);
      await batch.commit();
      setIsLoading(false);
      setConjuntoEditable({ ...conjuntoInitial });
      setArticuloBuscar({ ...initialInput });
      setMensajeAlerta("Enviado a la base de datos.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  return (
    <Container>
      <BotonQuery conjuntoEditable={conjuntoEditable} />
      <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
        Datos:
      </TituloModulo>
      <WrapGr>
        <CajaInterna>
          <Detail1InputWrap>
            <Detalle2Titulo>Titulo</Detalle2Titulo>

            <InputEditable
              type="text"
              value={conjuntoEditable.titulo}
              name="titulo"
              autoComplete="off"
              className="clearModern"
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </Detail1InputWrap>
          <Detail1InputWrap>
            <Detalle2Titulo>Sub titulo</Detalle2Titulo>

            <InputEditable
              type="text"
              name="subTitulo"
              value={conjuntoEditable.subTitulo}
              autoComplete="off"
              className={"clearModern"}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </Detail1InputWrap>
          <Detail1InputWrap>
            <Detalle2Titulo>N° Proyecto</Detalle2Titulo>

            <InputEditable
              type="text"
              name="noProyecto"
              value={conjuntoEditable.noProyecto}
              autoComplete="off"
              className={"clearModern"}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </Detail1InputWrap>
          <Detail1InputWrap className="vertical">
            <Detalle2Titulo className="vertical">Descripcion</Detalle2Titulo>

            <TextArea2
              type="text"
              value={conjuntoEditable.descripcion}
              name="descripcion"
              autoComplete="off"
              className={Theme.config.modoClear ? "clearModern" : ""}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </Detail1InputWrap>
          <Detail1InputWrap className="vertical">
            <Detalle2Titulo className="vertical">Observaciones</Detalle2Titulo>
            {conjuntoEditable.observaciones.map((item, index) => {
              return (
                <InputEditable
                  key={index}
                  type="text"
                  value={item}
                  name="observaciones"
                  autoComplete="off"
                  data-index={index}
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                />
              );
            })}

            <CajaBtn>
              <BtnGeneralButton onClick={() => addObs()}>+</BtnGeneralButton>
              <BtnGeneralButton onClick={() => removeLastObs()}>
                -
              </BtnGeneralButton>
            </CajaBtn>
          </Detail1InputWrap>
        </CajaInterna>
        <CajaInterna>
          <CajaTituloProduc>
            <Detalle2Titulo className="">Productos:</Detalle2Titulo>
          </CajaTituloProduc>
          <CajaTablaGroup2>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Accion</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {conjuntoEditable.items.map((item, index) => {
                  return (
                    <FilasGroup className="body" key={index}>
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        {item.descripcion}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ParrafoAction
                          data-index={index}
                          onClick={(e) => removeArticulo(e)}
                        >
                          ❌
                        </ParrafoAction>
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup2>
          <br />
          <CajaBuscarItem>
            <CajaInput className="codigo">
              <WrapCodigo>
                <Icono icon={faMagnifyingGlass} />
                <InputSimple
                  className="codigo"
                  name="codigoBuscar"
                  value={articuloBuscar.codigo}
                  list="articulos"
                  onChange={(e) => handleInputs(e)}
                  autoComplete="off"
                />
              </WrapCodigo>
              <DataList id="articulos">
                {ListaArticulos.map((item, index) => {
                  return (
                    <Opcion value={item.codigo} key={index}>
                      {item.descripcion}
                    </Opcion>
                  );
                })}
              </DataList>
            </CajaInput>
            <CajaInput className="descripcion">
              <InputSimple
                disabled
                className="disabled descripcion"
                value={articuloBuscar.descripcion}
              />
            </CajaInput>
            <CajaInput>
              <BtnSimple onClick={() => addArticulo()} type="submit">
                Agregar
              </BtnSimple>
            </CajaInput>
          </CajaBuscarItem>
        </CajaInterna>
      </WrapGr>
      <br />
      <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
        Medios:
      </TituloModulo>

      <CajaImagenesAdd>
        <SubTitulo>Imagenes</SubTitulo>
        <MenuPestannias
          handlePestannias={handlePestannias}
          arrayOpciones={arrayOpciones}
        />
        {arrayOpciones.find((opcion) => opcion.select).code == "individual" && (
          <WrapGrand>
            {conjuntoEditable.imagenes.map((img, index) => {
              return (
                <WrapGr key={index}>
                  <CajaInterna>
                    <Detail1InputWrap>
                      <Detalle2Titulo>Titulo Imagen</Detalle2Titulo>
                      <InputEditable
                        type="text"
                        value={img.titulo}
                        name="titulo"
                        data-propiedad="imagenes"
                        data-index={index}
                        autoComplete="off"
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        onChange={(e) => {
                          handleInputs(e);
                        }}
                      />
                    </Detail1InputWrap>
                    <Detail1InputWrap className="vertical">
                      <Detalle2Titulo className="vertical">
                        Descripcion Imagen
                      </Detalle2Titulo>
                      <TextArea2
                        type="text"
                        value={img.textoDescriptivo}
                        name="textoDescriptivo"
                        data-propiedad="imagenes"
                        data-index={index}
                        autoComplete="off"
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        onChange={(e) => {
                          handleInputs(e);
                        }}
                      />
                    </Detail1InputWrap>
                    <Detail1InputWrap className="vertical">
                      <Detalle2Titulo className="vertical">
                        Archivo imagen
                      </Detalle2Titulo>
                      <InputEditable
                        type="file"
                        accept="image/*"
                        name="archivo"
                        data-propiedad="imagenes"
                        data-index={index}
                        autoComplete="off"
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        onChange={(e) => {
                          handleInputs(e);
                        }}
                      />
                    </Detail1InputWrap>
                  </CajaInterna>
                  <CajaInterna>
                    <CajaImgLine>
                      {img.URLLocalAux ? (
                        <ImagenLine src={img.URLLocalAux} />
                      ) : (
                        <ImagenLine className="icono" src={imgImagen} />
                      )}
                    </CajaImgLine>
                  </CajaInterna>
                </WrapGr>
              );
            })}
            <CajaBtnGrand>
              <BtnGeneralButton onClick={() => addImagen("imagenes")}>
                +
              </BtnGeneralButton>
              <BtnGeneralButton onClick={() => removeImagen("imagenes")}>
                -
              </BtnGeneralButton>
            </CajaBtnGrand>
          </WrapGrand>
        )}
        {arrayOpciones.find((opcion) => opcion.select).code == "grupo" && (
          <WrapGrand>
            <WrapGr>
              <CajaInterna>
                <Detail1InputWrap>
                  {/* <Detalle2Titulo>Titulo Imagen</Detalle2Titulo> */}
                  <InputEditable
                    type="file"
                    accept="image/*"
                    multiple
                    name="socioNegocio"
                    autoComplete="off"
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    onChange={(e) => {
                      // handleInputs(e);
                    }}
                  />
                </Detail1InputWrap>
              </CajaInterna>
            </WrapGr>
          </WrapGrand>
        )}
      </CajaImagenesAdd>
      <br />
      <br />
      <CajaImagenesAdd>
        <SubTitulo>Videos (YouTube)</SubTitulo>
        <br />
        <WrapGrand>
          {conjuntoEditable.videos.map((video, index) => {
            return (
              <WrapGr key={index}>
                <CajaInterna>
                  <Detail1InputWrap>
                    <Detalle2Titulo>Titulo Video</Detalle2Titulo>
                    <InputEditable
                      type="text"
                      value={video.titulo}
                      name="titulo"
                      data-propiedad="videos"
                      data-index={index}
                      autoComplete="off"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      onChange={(e) => {
                        handleInputs(e);
                      }}
                    />
                  </Detail1InputWrap>
                  <Detail1InputWrap className="vertical">
                    <Detalle2Titulo className="vertical">
                      Descripcion video
                    </Detalle2Titulo>
                    <TextArea2
                      type="text"
                      data-propiedad="videos"
                      data-index={index}
                      value={video.textoDescriptivo}
                      name="textoDescriptivo"
                      autoComplete="off"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      onChange={(e) => {
                        handleInputs(e);
                      }}
                    />
                  </Detail1InputWrap>
                  <Detail1InputWrap>
                    <InputEditable
                      type="text"
                      data-propiedad="videos"
                      data-index={index}
                      placeholder="URL Video YouTube"
                      value={video.url}
                      name="url"
                      autoComplete="off"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      onChange={(e) => {
                        handleInputs(e);
                      }}
                    />
                  </Detail1InputWrap>
                </CajaInterna>
                <CajaInterna>
                  <CajaImgLine>
                    {video.url ? (
                      <iframe
                        width="560"
                        height="315"
                        src={getYoutubeIdFromUrl(video.url)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen={false}
                      ></iframe>
                    ) : (
                      <ImagenLine className="icono" src={imgVideo} />
                    )}
                  </CajaImgLine>
                </CajaInterna>
              </WrapGr>
            );
          })}
          <CajaBtnGrand>
            <BtnGeneralButton onClick={() => addImagen("videos")}>
              +
            </BtnGeneralButton>
            <BtnGeneralButton onClick={() => removeImagen("videos")}>
              -
            </BtnGeneralButton>
          </CajaBtnGrand>
        </WrapGrand>
        <br />
        <br />
        <CajaBtnFinal>
          <BtnFinal onClick={() => enviarDatos()}>Enviar</BtnFinal>
        </CajaBtnFinal>
      </CajaImagenesAdd>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Container>
  );
}
const CajaBtnFinal = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const BtnFinal = styled(BtnGeneralButton)`
  padding: 12px;
`;
const CajaBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Container = styled.div``;
const WrapGr = styled.div`
  color: ${Tema.neutral.blancoHueso};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  border: 1px solid white;
  border-radius: 10px;
  display: flex;
`;
const CajaInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  min-height: 150px;
`;
const Titulo = styled.h2`
  font-size: 1%.4;
  text-decoration: underline;
  color: white;
`;
const TituloModulo = styled(Titulo)`
  margin-bottom: 15px;
  padding-left: 25px;
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
`;
const InputEditable = styled(InputSimpleEditable)``;
const TextArea2 = styled(TextArea)`
  min-height: 70px;
  height: 70px;
`;
const CajaTituloProduc = styled.div`
  width: 100%;
  height: 25px;
  color: white;
  text-decoration: underline;
`;
const CajaTablaGroup2 = styled(CajaTablaGroup)`
  height: auto;
`;
const CajaBuscarItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 7px;
`;

const CajaInput = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.codigo {
  }
  &.descripcion {
    width: 100%;
  }
`;
const WrapCodigo = styled.div`
  width: 50%;
  position: relative;
`;
const InputSimple = styled(InputSimpleEditable)`
  height: 30px;
  border-radius: 4px;
  padding: 12px;
  &.codigo {
    width: 100%;
    padding-left: 35px;
  }
  &.descripcion {
    width: 100%;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  border-radius: 4px;
  height: 30px;
  width: 120px;
  transition: all 0.2s ease;
  margin: 0;
`;
const DataList = styled.datalist`
  width: 150%;
`;
const Opcion = styled.option``;

const Icono = styled(FontAwesomeIcon)`
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translate(0, -50%);
  color: #353232;
`;
const SubTitulo = styled.h3`
  font-weight: 400;
  color: white;
  text-decoration: underline;
`;
const CajaImagenesAdd = styled.div`
  min-height: 60px;
  padding: 0 25px;
`;
const CajaImgLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  height: 100%;
`;
const ImagenLine = styled.img`
  width: 70%;
  max-height: 200px;
  &.icono {
    width: 100px;
  }
`;
const WrapGrand = styled.div`
  width: 100%;
`;
const CajaBtnGrand = styled.div`
  display: flex;
  justify-content: center;
`;
