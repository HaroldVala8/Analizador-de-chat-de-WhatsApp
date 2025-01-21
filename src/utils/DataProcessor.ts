export interface WhatsAppMessage {
    Fecha: Date; // Fecha como objeto Date
    Hora: string; // Hora como string
    Remitente: string;
    Mensaje: string;
  }
  
  export const processWhatsAppChat = (content: string): WhatsAppMessage[] => {
    const patronNuevoMensaje =
      /^\[\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2}(?:\s?[ap]\.m\.)?\]/;
    const patronPartesMensaje =
      /\[(\d{2}\/\d{2}\/\d{2}), (\d{1,2}:\d{2}:\d{2}(?:\s?[ap]\.m\.)?)\] (.*?): (.*)/;
  
    const lines = content.split("\n");
    const datosMensajes: WhatsAppMessage[] = [];
    let mensajeActual = null;
    let fechaActual = null;
    let horaActual = null;
    let remitenteActual = null;
  
    for (let linea of lines) {
      linea = linea.replace(/[\u200E\u202C\u202A]/g, "");
  
      if (patronNuevoMensaje.test(linea)) {
        if (mensajeActual) {
          datosMensajes.push({
            Fecha: new Date(fechaActual!),
            Hora: horaActual!,
            Remitente: remitenteActual!,
            Mensaje: mensajeActual!,
          });
        }
  
        const match = patronPartesMensaje.exec(linea);
        if (match) {
          [fechaActual, horaActual, remitenteActual, mensajeActual] = match.slice(1);
          fechaActual = convertirFechaAISO(fechaActual);
        } else {
          mensajeActual = null;
          console.warn("Línea no procesada correctamente:", linea);
        }
      } else if (mensajeActual) {
        mensajeActual += " " + linea.trim();
      }
    }
  
    if (mensajeActual) {
      datosMensajes.push({
        Fecha: new Date(fechaActual!),
        Hora: horaActual!,
        Remitente: remitenteActual!,
        Mensaje: mensajeActual!,
      });
    }
  
    return datosMensajes;
  };
  
  const convertirFechaAISO = (fecha: string): string => {
    const [dia, mes, anio] = fecha.split("/");
    return `20${anio}-${mes}-${dia}`;
  };
  