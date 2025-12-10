import React, { useState } from "react";
import styled from "styled-components";
import MenuPestannias from "../../components/MenuPestannias";
import ImgEngranes from "./../../../public/img/variedad/engranes.jpg";
import { ClearTheme } from "../../config/theme";

export default function DocTMS() {
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Acerca de",
      code: "acercaDe",
      select: true,
    },
    {
      nombre: "Tutoriales",
      code: "tutoriales",
      select: false,
    },
    {
      nombre: "FAQs",
      code: "faqs",
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
  return (
    <Container>
      <MenuPestannias
        arrayOpciones={arrayOpciones}
        handlePestannias={handlePestannias}
      />
      {arrayOpciones.find((opcion) => opcion.select).code == "acercaDe" && (
        <WrapTexto>
          <Titulo>¿Qué es el TMS?</Titulo>
          <Parrafo>
            El TMS (Transportation Management System) es un módulo diseñado para
            optimizar y digitalizar la gestión del transporte dentro de Cielos
            Acústicos. Forma parte de la plataforma Caeloss, un ecosistema de
            automatización de nuestros procesos internos. Su objetivo es brindar
            una herramienta centralizada para planificar, ejecutar y controlar
            todas las operaciones relacionadas con el transporte de mercancías,
            logrando mayor eficiencia, trazabilidad y control. Todo queda
            registrado para posterior análisis y toma de decisiones.
          </Parrafo>
          <br />
          <Titulo>¿Por qué es importante?</Titulo>
          <ListaDesordenada>
            <li>✅ Visibilidad total en tiempo real</li>
            <li>✅ Facilita la gestion administrativa</li>
            <li>✅ Optimiza el proceso para realizar solicitudes</li>
            <li>✅ Mejor acceso a la informacion</li>
            <li>✅ Análisis y mejora continua</li>
            <li>✅ Reduce los costos operativos</li>
            <li>✅ Aumenta la eficiencia logística</li>
            <li>✅ Mejora la visibilidad de toda la operación</li>
            <li>✅ Optimiza recursos y tiempos de entrega</li>
            <li>✅ Facilita la toma de decisiones basada en datos</li>
          </ListaDesordenada>

          <br />
          <WrapEngranes>
            <WrapFunciona>
              <Titulo>¿Cómo funciona?</Titulo>
              <Parrafo>
                Está pensado para adaptarse a la medida exacta de nuestros
                procesos internos. Además, por ser parte de Caeloss, es
                susceptible a sugerencias y significa que no deja de mejorar. El
                solicitante realiza su solicitud, la cual es procesada por los
                administradores del proceso logístico de cada sucursal,
                avanzándola en cada paso de su ciclo de vida. El solicitante y
                todos los involucrados pueden consultar en todo momento el
                estatus de la solicitud; además, pueden indicarle a Caeloss que
                les notifique cada vez que ocurra un cambio de estado en el
                ciclo de vida.
              </Parrafo>
            </WrapFunciona>
            <Img src={ImgEngranes} />
          </WrapEngranes>
          <br />
          <Titulo>Datos técnicos</Titulo>
          <Parrafo>
            El Sistema de Gestión de Transporte (TMS) está diseñado para operar
            en entornos web, garantizando la accesibilidad desde cualquier
            dispositivo con conexión a internet. Su arquitectura modular permite
            una integración sencilla con otros sistemas empresariales, como
            nuestro ERP SAP.
          </Parrafo>
          <ListaDesordenada>
            <li>
              ☁️
              <Span> Plataforma: </Span>Aplicación web basada en tecnología en
              la nube.
            </li>
            <li>
              🚀
              <Span> Velocidad: </Span>Procesamiento ágil y respuesta en tiempo
              real para todas las operaciones.
            </li>
            <li>
              🗄️
              <Span> Base de datos:</Span> Escalable y segura, diseñada para
              manejar grandes volúmenes de información.
            </li>
            <li>
              💻
              <Span> Compatibilidad: </Span>Funciona en navegadores modernos y
              dispositivos móviles.
            </li>
            <li>
              🔒
              <Span> Seguridad:</Span> Incluye autenticación de usuarios,
              encriptación de datos y control de accesos.
            </li>

            <li>
              ⚡<Span> Disponibilidad:</Span> 99.9% de uptime garantizado en la
              nube.
            </li>
          </ListaDesordenada>

          <br />
          <br />
          <Titulo>Proyección</Titulo>
          <Parrafo>
            Existe una interesante lista de funcionalidades para agregar a
            nuestro TMS, y con frecuencia se añaden más funciones a través de
            sugerencias de los usuarios.
          </Parrafo>
        </WrapTexto>
      )}

      {arrayOpciones.find((opcion) => opcion.select).code == "tutoriales" && (
        <WrapTexto>
          <Titulo>Tutorial general TMS</Titulo>
          <SubTitulo>Host: Jennifer Sanchez</SubTitulo>

          <CajitaVideo>
            <iframe
              width="800"
              height="380"
              src={"https://www.youtube.com/embed/M1Y3tcEXRxo"}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </CajitaVideo>
        </WrapTexto>
      )}
      {arrayOpciones.find((opcion) => opcion.select).code == "faqs" && (
        <WrapTexto>
          <Titulo className="underline">Preguntas frecuentes</Titulo>
          <Titulo className="small">
            ¿Cómo puede el cliente calificar su solicitud de transporte?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            El cliente puede calificar su solicitud de transporte a través de un
            enlace que puede generar únicamente el solicitante. Este enlace se
            genera presionando el botón Copiar Link que se encuentra en la caja
            tipo slider a la derecha de la solicitud.
          </Parrafo>
          <Titulo className="small">
            ¿Porque no aparece el boton Copiar Link en la caja tipo slider de la
            solicitud?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            El botón <i>Copiar Link</i> aparece únicamente al solicitante y
            cuando la solicitud está concluida.
          </Parrafo>
          <Titulo className="small">
            ¿Para qué es útil calificar las solicitudes?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            Nos permite, como empresa, medir el nivel de satisfacción de
            nuestros clientes en cuanto a la gestión de transportes. Además,
            permite identificar malas o buenas conductas de nuestros
            transportistas y también nos permite detectar malas experiencias de
            nuestros clientes para subsanarlas.
          </Parrafo>
          <Titulo className="small">
            ¿Que sentido tiene que el solicitante califique su propia solicitud?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            Esta funcionalidad existe por dos razones:
          </Parrafo>
          <ListaNum>
            <li>
              Porque, en ocasiones, el cliente comunica alguna mala o muy buena
              experiencia pero no desea calificar él mismo. En tal caso, el
              solicitante puede colocar los comentarios del cliente.
            </li>
            <li>
              El solicitante, como tal, puede calificar según su conformidad con
              el servicio del equipo de logística.
            </li>
          </ListaNum>
          <Titulo className="small">
            ¿Cómo puedo encontrar una solicitud ya concluida, que no aparece en
            el listado de solicitudes activas?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            La forma más fácil es con la función buscar o, si conoces el número,
            puedes ir a Maestros y acceder directamente. Además, puedes emitir
            un reporte en la página de reportes.
          </Parrafo>
          <Titulo className="small">
            ¿Por que en la lista de solicitudes activas, solo se visualiza las
            creadas por mi?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            Tienes acceso a todas las solicitudes, esto es información sin
            restricciones, pero el panel de solicitudes activas es una forma
            rápida de acceder a las solicitudes de tu interés, que son las
            creadas por ti. Si deseas abrir una solicitud que creó algún
            compañero, necesitas conocer algún dato de la misma, ya sea número,
            cliente, destino, etc., o puedes emitir un reporte.
          </Parrafo>

          <Titulo className="small">
            ¿Por qué ya no recibo notificaciones de las solicitudes?
          </Titulo>
          <Parrafo className="paddinLeft marginBotom">
            Las notificaciones a tu correo por cambio de estado de solicitudes
            siguen en vigor, pero ahora debes indicar al TMS cuándo quieres
            recibir notificaciones. Esto lo haces mientras creas la solicitud,
            en la caja de destinatarios de notificaciones, donde te agregas como
            un usuario más.
          </Parrafo>
        </WrapTexto>
      )}
    </Container>
  );
}
const Container = styled.div``;
const WrapTexto = styled.div`
  padding: 0 25px;
  padding-top: 15px;
  color: white;
`;
const Titulo = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  color: ${ClearTheme.complementary.warning};
  &.small {
    font-size: 1.3rem;
    /* color: white; */
  }
  &.underline {
    text-decoration: underline;
  }
`;
const SubTitulo = styled.h3`
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 400;
`;
const Parrafo = styled.p`
  &.paddinLeft {
    padding-left: 25px;
  }
  &.marginBotom {
    margin-bottom: 15px;
  }
`;
const WrapEngranes = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;
const WrapFunciona = styled.div`
  width: 50%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;
const Img = styled.img`
  width: 50%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
  border-radius: 6px;
  box-shadow: ${ClearTheme.config.sombra};
`;
const Span = styled.span`
  font-weight: 600;
`;
const CajitaVideo = styled.div`
  display: flex;
  /* justify-content: center; */
`;
const ListaDesordenada = styled.ul`
  padding-left: 25px;
`;
const ListaNum = styled.ol`
  padding-left: 45px;
`;
