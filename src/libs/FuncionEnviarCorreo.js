import {
  gruposCorreos,
  soloTodosCorreos,
} from "../components/corporativo/TodosLosCorreosCielosDB";
import { app } from "../firebase/firebaseConfig";

export const FuncionEnviarCorreo = async ({ para, asunto, mensaje }) => {
  // 🟢1-Dame solo los destinos que no son grupo
  // Estos son string tomar en cuenta
  const correosQueNoSonGrupos = para.filter((destino) => {
    const quitar = gruposCorreos.some((grupo) => grupo.correo == destino);

    if (!quitar) {
      return destino;
    }
  });
  // 🟢2-Dame solo los destinos que si son grupos
  // Estos son objetos con varias propiedades
  const correosQueSiSonGrupos = gruposCorreos.filter((grupo) => {
    const permitir = para.some((correo) => correo == grupo.correo);
    if (permitir) {
      return grupo;
    }
  });
  // 🟢2.5-Ahora de esos grupos de correos, dame los usuarios que esten dentro de esos grupos
  // Estos siguen siendo objetos que no son grupos
  const destinosDeGrupos = soloTodosCorreos.filter((destino) => {
    const permitir = correosQueSiSonGrupos.some((grupo) =>
      destino.grupos.includes(grupo.code)
    );

    if (permitir) {
      return destino;
    }
  });

  // 🟢2.9 Ahora esos destinos conviertelos a string de correos
  const corresLimpiosDeGrupos = destinosDeGrupos.map((correo) => correo.correo);

  // 🟢3-Ahora haz un conglo de ambos array de string
  const conglo = [...corresLimpiosDeGrupos, ...correosQueNoSonGrupos];
  try {
    const functionURL = `https://us-central1-${app.options.projectId}.cloudfunctions.net/sendEmailTrue`;
    const response = await fetch(functionURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: conglo,
        subject: asunto,
        html: mensaje,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al llamar a la función:", errorData);
      throw new Error(
        `Error al llamar a la función: ${response.status} - ${errorData.error || "Internal Server Error"}`
      );
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al llamar a la función:", error);
  }
};
