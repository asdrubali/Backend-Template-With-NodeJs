import moment from "moment";
import Server from "./server/index.server";
import config from "./config/environments";
import { DataBase } from "./database";
import {
  getFechaPeruDate,
  getFechaPeruDateFormatted,
} from "./api/functions/globalVariables";

export const server = Server.init(Number(config.PORT));

export const _socket = server._socket;

process.setMaxListeners(0);

// Get the current date and time in UTC
const fechaUTC = moment.utc();

server.start(() => {
  console.log("Server on fire " + config.PORT);
  DataBase.instance;
  console.log("Moment UTC: ", fechaUTC.format("YYYY-MM-DD HH:mm:ss"));
  console.log("Moment Perú: ", getFechaPeruDateFormatted());
});
