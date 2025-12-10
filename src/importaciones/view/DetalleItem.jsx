import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useParams } from "react-router-dom";
import "./../components/interruptor.css";
import { Alerta } from "../../components/Alerta";
import { CSSLoader } from "../../components/CSSLoader";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ClearTheme, Tema } from "../../config/theme";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import ImgInfo from "../../../public/img/informacion.png";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import statusImportaciones from "../components/FuncionStatus.jsx";
import { fechaConfirmada } from "../components/libs.jsx";
import { Interruptor } from "../../components/Interruptor.jsx";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition.js";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { DestinatariosCorreo } from "../../components/DestinatariosCorreo.jsx";
import { BtnNormal } from "../../components/BtnNormal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ES6AFormat } from "../../libs/FechaFormat.jsx";

import { notificacionesDBSchema } from "../../models/notificacionesDBSchema.js";
import { TodosLosCorreosCielosDB } from "../../components/corporativo/TodosLosCorreosCielosDB.js";
import TextoEptyG from "../../components/TextoEptyG.jsx";

export const DetalleItem = ({
  userMaster,
  cargaFurgones,
  cargaOrdenes,
  itemsFurgon,
  itemsOrden,
}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const parametro = useParams();
  const docUser = parametro.id;

  const [hasAviso, setHasAviso] = useState(false);

  const [itemRelativo, setItemRelativo] = useState({});
  useEffect(() => {
    const item0Furgon = itemsFurgon[0];
    const item0Orden = itemsOrden[0];
    let itemUtilizar = {};
    if (item0Furgon) {
      itemUtilizar = item0Furgon;
    } else if (item0Orden) {
      itemUtilizar = item0Orden;
    } else {
      itemUtilizar = {
        codigo: docUser,
        descripcion: "",
      };
    }

    setItemRelativo(itemUtilizar);
  }, [itemsOrden, itemsFurgon]);

  // ************************** DESTINATARIOS DE NOTIFICACIONES ************************** //

  const initiaValueDest = {
    nombre: "",
    correo: "",
  };
  const [hasModal, setHasModal] = useState(false);

  const [notificacionThisOrden, setNotificacionThisOrden] = useState({
    ...notificacionesDBSchema,
  });

  const llamarThisNotifi = async (force) => {
    const notiThisOrden = await fetchDocsByConditionGetDocs(
      "notificaciones",
      undefined,
      "idDoc",
      "==",
      itemRelativo.codigo
    );

    if (notiThisOrden.length > 0) {
      if (force || !notificacionThisOrden.id) {
        const item = notiThisOrden[0];
        setNotificacionThisOrden({ ...item });
        return item;
      } else {
        return notificacionThisOrden;
      }
    } else {
      return notificacionesDBSchema;
    }
  };
  useEffect(() => {
    if (userMaster?.correo && itemRelativo?.codigo) {
      (async () => {
        const thisNotificacion = await llamarThisNotifi();
        if (thisNotificacion) {
          const hasExiste = thisNotificacion?.destinatarios.find(
            (noti) => noti.correo == userMaster.correo
          );
          setIsFollowing(hasExiste);
        } else {
          setIsFollowing(false);
        }
      })();
    }
  }, [userMaster, itemRelativo, notificacionThisOrden]);
  const mostrarModalNoti = async () => {
    const docBuscado = await llamarThisNotifi();

    setNotificacionThisOrden(docBuscado);

    setHasModal(true);
  };
  const addDestinatario = (e) => {
    const { name, value } = e.target;
    if (notificacionThisOrden) {
      if (name == "add") {
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: [
            ...notificacionThisOrden.destinatarios,
            initiaValueDest,
          ],
        });
      } else {
        if (notificacionThisOrden.destinatarios.length > 2) {
          setNotificacionThisOrden({
            ...notificacionThisOrden,
            destinatarios: notificacionThisOrden.destinatarios.slice(0, -1),
          });
        }
      }
    } else {
      if (name == "add") {
        setNotificacionThisOrden({ ...notificacionesDBSchema });
      }
    }
  };
  const listaUsuarios = TodosLosCorreosCielosDB;
  const handleInputDestinatario = (e) => {
    const { name, value } = e.target;
    const indexDataset = Number(e.target.dataset.index);
    let usuarioFind = null;
    if (name == "nombre") {
      usuarioFind = listaUsuarios.find((user) => {
        if (user.nombre == value) {
          return user;
        }
      });

      if (usuarioFind) {
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: notificacionThisOrden.destinatarios.map(
            (desti, index) =>
              index === indexDataset
                ? { ...desti, nombre: value, correo: usuarioFind.correo }
                : desti
          ),
        });

        return;
      }
    } else if (name == "correo") {
      usuarioFind = listaUsuarios.find((user) => {
        if (user.correo == value) {
          return user;
        }
      });

      if (usuarioFind) {
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: notificacionThisOrden.destinatarios.map(
            (desti, index) =>
              index === indexDataset
                ? { ...desti, nombre: usuarioFind.nombre, correo: value }
                : desti
          ),
        });

        return;
      }
    }
    setNotificacionThisOrden({
      ...notificacionThisOrden,
      destinatarios: notificacionThisOrden.destinatarios.map((desti, index) =>
        index === indexDataset ? { ...desti, [name]: value } : desti
      ),
    });
  };
  const crearNuevoDocNoti = async (interruptor) => {
    const thisDestinatario = {
      nombre: userMaster.nombre + " " + userMaster.apellido,
      correo: userMaster.correo,
    };
    try {
      await addDoc(collection(db, "notificaciones"), {
        ...notificacionesDBSchema,
        ...notificacionThisOrden,
        tipoDoc: "articulosSGI",
        idDoc: itemRelativo.codigo,
        createdAt: ES6AFormat(new Date()),
        createdBy: userMaster.userName,
        destinatarios: interruptor
          ? [thisDestinatario]
          : notificacionThisOrden.destinatarios,
        numOrigenDoc: itemRelativo.codigo,
      });
      return true;
    } catch (error) {
      console.log(error);

      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return false;
    }
  };
  const guardarDestinatario = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let proceder = true;
    notificacionThisOrden.destinatarios.forEach((detino, index) => {
      if (detino.correo !== "") {
        if (regex.test(detino.correo) == false) {
          setMensajeAlerta(`Correo N° ${index + 1} formato incorrecto.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
      if (detino.correo !== "" || detino.nombre !== "") {
        if (detino.correo == "" || detino.nombre == "") {
          setMensajeAlerta(
            `Destinatario N° ${index + 1} llenar correctamente.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
    });

    if (proceder) {
      try {
        setIsLoading(true);

        // Si la notificacion existe, entonces actualizala,

        if (notificacionThisOrden.id) {
          const notiActualizar = doc(
            db,
            "notificaciones",
            notificacionThisOrden.id
          );
          const destinatarioFilter = notificacionThisOrden.destinatarios.filter(
            (desti) => desti.correo != ""
          );
          await updateDoc(notiActualizar, {
            destinatarios: destinatarioFilter,
          });
          setNotificacionThisOrden({
            ...notificacionThisOrden,
            destinatarios: destinatarioFilter,
          });
          const hasUpdate = destinatarioFilter.find(
            (desti) => desti.correo == userMaster.correo
          );
          setIsFollowing(hasUpdate);
        }
        // Si no existe crea una nueva
        else {
          crearNuevoDocNoti();
        }
        setIsLoading(false);
        setHasModal(false);
        setMensajeAlerta("Cambios guardados correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setHasModal(false);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
  };
  // ************************** SEGUIMIENTO ************************** //
  const [isFollowing, setIsFollowing] = useState(false);

  const handleChangeInterruptor = async (e) => {
    const checK = e.target.checked;
    setIsFollowing(checK);

    try {
      setIsLoading(true);
      const seguiConluido = () => {
        setIsLoading(false);
        setHasModal(false);
        if (checK) {
          setMensajeAlerta("Seguimiento activado.");
        } else {
          setMensajeAlerta("Seguimiento desactivado.");
        }

        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        llamarThisNotifi(true);
      };
      // Si existe el documento de notificaciones actualizado
      const docBuscado = await llamarThisNotifi();
      if (docBuscado.id) {
        // Si no existe crea uno nuevo
        console.log(docBuscado);
        const notiActualizar = doc(db, "notificaciones", docBuscado.id);

        const hasNotifiThisUser = docBuscado.destinatarios.find(
          (destino) => destino.correo == userMaster.correo
        );

        // Si el usuario esta activnado y ademas no existe la notificacion
        // Agregala
        if (checK && !hasNotifiThisUser) {
          const destinatarioParsed = docBuscado.destinatarios.filter((dest) => {
            if (dest.nombre && dest.correo) {
              return { ...dest };
            }
          });
          const nuevaNoti = {
            nombre: userMaster.nombre + " " + userMaster.apellido,
            correo: userMaster.correo,
          };
          await updateDoc(notiActualizar, {
            destinatarios: [...destinatarioParsed, nuevaNoti],
          });
        }

        // Si el usuario esta desactivando y ademas si existe la notificacion
        // Eliminala
        else if (!checK && hasNotifiThisUser) {
          const destinatarioParsed = docBuscado.destinatarios.filter((dest) => {
            if (dest.correo != userMaster.correo) {
              return { ...dest };
            }
          });

          await updateDoc(notiActualizar, {
            destinatarios: [...destinatarioParsed],
          });
        }
        seguiConluido();
      } else {
        const docCreado = await crearNuevoDocNoti(true);
        if (docCreado) {
          seguiConluido();
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setHasModal(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  // ******************* ETAs *******************
  const [modalProyecciones, setModalProyecciones] = useState(false);
  const [itemSelectProy, setItemSelectProy] = useState({});
  const mostrarModalETAs = (item) => {
    setModalProyecciones(true);

    const ordenFind = item.datosOrden;
    console.log(ordenFind);
    const partidasThisItem =
      ordenFind?.partidas?.filter((part) => {
        const hasItem = part.materiales.find(
          (product) => product.codigo == item.codigo
        );

        if (hasItem) {
          return part;
        }
      }) || [];

    console.log(item);

    const partidasParsed2 = partidasThisItem.flatMap((part) => {
      return part.materiales.map((mat) => ({
        fechaProgAux: part.fechaProyectada,
        ...mat,
      }));
    });

    console.log(partidasParsed2);
    const soloEsteItem = partidasParsed2.filter(
      (proy) => proy.codigo == item.codigo
    );

    setItemSelectProy({
      ...item,
      partidasAux: soloEsteItem,
    });
  };
  return (
    <>
      <Container>
        <CajaEncabezado>
          <CajaDetalles>
            <Detalle1Wrap>
              <Detalle2Titulo>Codigo:</Detalle2Titulo>
              <Detalle3OutPut>{itemRelativo.codigo}</Detalle3OutPut>
            </Detalle1Wrap>
            <Detalle1Wrap>
              <Detalle2Titulo>Descripcion:</Detalle2Titulo>
              <Detalle3OutPut title={itemRelativo.descripcion}>
                {itemRelativo.descripcion}
              </Detalle3OutPut>
            </Detalle1Wrap>
            <Interruptor
              texto={"Seguimiento"}
              handleChange={(e) => handleChangeInterruptor(e)}
              isFollowing={isFollowing}
              tipo="ordenCompra"
              disabled={false}
            />
          </CajaDetalles>
        </CajaEncabezado>

        <>
          <BarraControles>
            {userMaster?.permisos?.includes("editBLIMS") && (
              <BtnNormal onClick={() => mostrarModalNoti()}>
                <Icono icon={faEnvelope} />
                Email
              </BtnNormal>
            )}
            <CajaMas>
              <Wrap onClick={() => setHasAviso(true)}>
                <ImgIconInfo src={ImgInfo} />
              </Wrap>
            </CajaMas>

            {hasAviso ? (
              <ModalInfo
                setHasAviso={setHasAviso}
                titulo={"Detalle item"}
                texto={
                  "Aqui se muestra dos listas; la primera contiene todas las cantidades ya enviadas por el proveedor hacia nuestros almacenes, basicamente son las cantidades que enviadas en contenedores y la segunda lista muestra todas las cantidades de este articulo en ordenes de compra aun sin enviar por el proveedor."
                }
              ></ModalInfo>
            ) : null}
          </BarraControles>

          <TituloBloque>Contenedores:</TituloBloque>
          <CajaTablaGroup2
            className={cargaFurgones == "loading" ? "cargandoSinQty" : ""}
          >
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Qty</CeldaHeadGroup>
                  <CeldaHeadGroup>Comentarios</CeldaHeadGroup>
                  <CeldaHeadGroup>Comentario Orden</CeldaHeadGroup>
                  <CeldaHeadGroup>Status</CeldaHeadGroup>
                  <CeldaHeadGroup>Listo SAP</CeldaHeadGroup>
                  <CeldaHeadGroup>Furgon*</CeldaHeadGroup>
                  <CeldaHeadGroup>Orden Compra*</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {itemsFurgon.map((item, index) => {
                  return (
                    <FilasGroup key={index} className="body">
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                      <CeldasBodyGroup
                        title={item.descripcion}
                        className="descripcion"
                      >
                        {item.descripcion}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.comentarios}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item.comentarioOrden ? item.comentarioOrden : ""}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup className="status">
                        {statusImportaciones(item.datosFurgon.status)}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item.datosFurgon.fechas.llegada05Concluido.fecha.slice(
                          0,
                          10
                        )}
                        {fechaConfirmada(
                          item.datosFurgon.fechas.llegada05Concluido.confirmada
                        )}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item.isCargaSuelta ? (
                          <Enlaces
                            to={`/importaciones/maestros/billoflading/${encodeURIComponent(
                              item.datosFurgon.datosBL.numeroBL
                            )}`}
                            target="_blank"
                          >
                            {item.datosFurgon.numeroDoc}
                          </Enlaces>
                        ) : (
                          <Enlaces
                            to={`/importaciones/maestros/contenedores/${encodeURIComponent(
                              item.datosFurgon.numeroDoc
                            )}`}
                            target="_blank"
                          >
                            {item.datosFurgon.numeroDoc}
                          </Enlaces>
                        )}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlaces
                          to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(item.ordenCompra)}`}
                          target="_blank"
                        >
                          {item.ordenCompra}
                        </Enlaces>
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>

            {cargaFurgones === "sinCantidades" && (
              <TituloSinQTY>
                No existen importaciones en proceso de este producto.
              </TituloSinQTY>
            )}
            {cargaFurgones === "loading" && (
              <CajaLoader>
                <CSSLoader />
              </CajaLoader>
            )}
          </CajaTablaGroup2>
        </>

        <>
          <TituloBloque>Ordenes de compra: </TituloBloque>

          <CajaTablaGroup2
            className={cargaFurgones == "loading" ? "cargandoSinQty" : ""}
          >
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Qty total</CeldaHeadGroup>
                  <CeldaHeadGroup>Qty Pendiente</CeldaHeadGroup>
                  <CeldaHeadGroup>Proyecciones</CeldaHeadGroup>
                  <CeldaHeadGroup>Qty Enviada</CeldaHeadGroup>
                  <CeldaHeadGroup>Comentarios</CeldaHeadGroup>
                  <CeldaHeadGroup>Comentario Orden</CeldaHeadGroup>
                  <CeldaHeadGroup>Orden Compra*</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {itemsOrden.map((item, index) => {
                  return (
                    <FilasGroup
                      key={index}
                      className={`body
                        ${index % 2 ? "impar" : ""}
                        `}
                    >
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.descripcion}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item.qty -
                          (item?.valoresAux?.cantidadTotalDespachosDB || "")}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ParrafoAction onClick={() => mostrarModalETAs(item)}>
                          👁️
                        </ParrafoAction>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item?.valoresAux?.cantidadTotalDespachosDB || 0}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{item.comentarios}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {item.comentarioOrden ? item.comentarioOrden : ""}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlaces
                          to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(
                            item.ordenCompra
                          )}`}
                          target="_blank"
                        >
                          {item.ordenCompra}
                        </Enlaces>
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>

            {cargaOrdenes === "sinCantidades" && (
              <TituloSinQTY>
                No existen ordenes de compra abiertas de este articulo.
              </TituloSinQTY>
            )}
            {cargaOrdenes === "loading" && (
              <CajaLoader>
                <CSSLoader />
              </CajaLoader>
            )}
          </CajaTablaGroup2>
        </>
      </Container>
      {hasModal && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={"Destinatarios de notificaciones"}
        >
          <ContenidoModal>
            <DestinatariosCorreo
              modoDisabled={false}
              arrayDestinatarios={notificacionThisOrden?.destinatarios || []}
              addDestinatario={addDestinatario}
              handleInputDestinatario={handleInputDestinatario}
              guardarDestinatario={guardarDestinatario}
            />
          </ContenidoModal>
        </ModalGeneral>
      )}
      {modalProyecciones && (
        <ModalGeneral
          setHasModal={setModalProyecciones}
          titulo={
            "Proyecciones de este producto en la orden de compra: " +
            itemSelectProy.ordenCompra
          }
        >
          <CajaProyecciones>
            <CajaTablaGroup>
              {itemSelectProy.partidasAux?.length > 0 ? (
                <TablaGroup>
                  <thead>
                    <FilasGroup className="cabeza">
                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                      <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                      <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                      <CeldaHeadGroup>Fecha</CeldaHeadGroup>
                      <CeldaHeadGroup>Cantidad</CeldaHeadGroup>
                    </FilasGroup>
                  </thead>
                  <tbody>
                    {itemSelectProy.partidasAux?.map((proyec, index) => {
                      return (
                        <FilasGroup className="body" key={index}>
                          <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                          <CeldasBodyGroup>{proyec.codigo}</CeldasBodyGroup>
                          <CeldasBodyGroup>
                            {proyec.descripcion}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>
                            {proyec.fechaProgAux.slice(0, 10)}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>{proyec.qty}</CeldasBodyGroup>
                        </FilasGroup>
                      );
                    })}
                  </tbody>
                </TablaGroup>
              ) : (
                <TextoEptyG texto={"~ Sin proyecciones. ~"} />
              )}
            </CajaTablaGroup>
          </CajaProyecciones>
        </ModalGeneral>
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};
const ContenidoModal = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  margin: auto;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const CajaEncabezado = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  @media screen and (max-width: 830px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  border: 1px solid white;
  color: white;

  &.seguimiento {
    width: 50%;
    display: flex;
    gap: 15px;
    @media screen and (max-width: 830px) {
      width: 90%;
    }
    @media screen and (max-width: 450px) {
      flex-direction: column;
    }
  }
  @media screen and (max-width: 830px) {
    width: 90%;
    margin-bottom: 15px;
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-around;
`;
const TituloDetalle = styled.p`
  width: 49%;
  color: ${Tema.secondary.azulOpaco};
`;
const DetalleTexto = styled.p`
  text-align: end;
  width: 49%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${Tema.secondary.azulOpaco};
  &.descripcion {
    width: auto;
  }
`;
const TituloBloque = styled.h2`
  text-decoration: underline;
  color: #fff;
  font-size: 1%.7;
  margin-left: 10px;
  margin-bottom: 5px;
  /* color: ${Tema.primary.azulBrillante}; */
`;

const TextoDescriptivo = styled.p`
  color: #2c2929;
  padding-left: 25px;
  padding-left: 35px;
  color: ${Tema.secondary.azulOpaco};
  background-color: ${Tema.secondary.azulProfundo};
  padding: 0 15px;
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${Tema.secondary.azulSuave};
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  color: ${Tema.secondary.azulOpaco};
  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
`;

const CeldaHead = styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  height: 25px;
  border: 1px solid black;
  padding-left: 5px;
  padding-right: 5px;
  &.numeroBL {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;

  &.descripcion {
    /* border: 1px solid red; */
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.status {
    /* border: 1px solid red; */
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.romo {
    cursor: pointer;

    &:hover {
    }
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CajaLoader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 20px;
  /* border: 1px solid red; */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &.ultima {
    margin-bottom: 80px;
  }
`;
const Wrap = styled.div`
  /* position: absolute; */

  width: 35px;
  height: 30px;
  margin-left: 25px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ease all 0.2s;
  background-color: #818181;
  border-radius: 4px;
  &:hover {
    transform: scale(1.1);
    right: 5px;
    background-color: ${ClearTheme.complementary.warning};
    cursor: pointer;
  }
`;
const ImgIconInfo = styled.img`
  width: 25px;
`;

const BarraControles = styled.div`
  /* height: 40px; */
  display: flex;
  width: 100%;
  background-color: #0e488f67;

  backdrop-filter: blur(3px);
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const CajaTablaGroup2 = styled(CajaTablaGroup)`
  &.cargandoSinQty {
    min-height: 150px;
  }
`;
const TituloSinQTY = styled.h2`
  width: 100%;
  color: white;
  font-weight: 400;
  text-align: center;
`;
const CajaProyecciones = styled.div`
  min-height: 100px;
  width: 100%;
`;
const CajaMas = styled.div`
  display: flex;
  min-width: 200px;
  justify-content: end;
  height: 100%;
  position: absolute;
  right: 0;
`;

const CajaApariencia = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  /* position: relative; */
`;
