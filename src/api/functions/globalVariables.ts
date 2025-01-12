import moment from "moment-timezone";

// Configurar Moment.js para la zona horaria de Lima
moment.tz.setDefault("America/Lima");

type WeekdaysDictionary = { [key: number]: string };

export function formatDateToYYYYMMDD(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export const FechaHoraPeru = moment();
export const FechaPeruDate = FechaHoraPeru.toDate();

export const getFechaPeruDate = (): Date => {
  const fechaHoraPeru = moment.utc();
  fechaHoraPeru.subtract(5, "hours");
  return fechaHoraPeru.toDate();
};

export const getFechaPeruDateFormatted = (): string => {
  const fechaHoraPeru = moment.utc();
  fechaHoraPeru.subtract(5, "hours");
  const fechaFormateada = fechaHoraPeru.format("YYYY-MM-DD HH:mm:ss");
  return fechaFormateada;
};

export const RegexPassword =
  /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040_])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;

