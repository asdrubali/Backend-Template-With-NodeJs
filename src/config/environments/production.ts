import path from "path";
import { TKEnvironments } from "../interfaces/environmets.interface";

export interface Production extends TKEnvironments {}

export const production: Production = {
  MODE: process.env.NODE_ENV,

  PORT: process.env.PROY_APP_PORT,


  PROY_BD: process.env.PROY_BD || "",
  PROY_BD_HOST: process.env.PROY_BD_HOST,
  PROY_BD_USER: process.env.PROY_BD_USER,
  PROY_BD_PASS: process.env.PROY_BD_PASS,
  PROY_BD_PORT: process.env.PROY_BD_PORT,

  SECRET_HIDDEN_KEY: process.env.SECRET_HIDDEN_KEY,

  SEND_TRANSPORTER: process.env.SEND_TRANSPORTER,
  SENDER: process.env.SENDER,
  SENDER_PASS: process.env.SENDER_PASS,
  SENDER_ALIAS: process.env.SENDER_ALIAS,
  SENDGRID_KEY: process.env.SENDGRID_KEY,

  CLIENT_ID: process.env.CLIENT_ID,

  DIR: path.join(__dirname, "../../"),
  DIR_ASSETS: path.join(__dirname, "../../", "assets"),

  PROY_BEURL: process.env.PROY_BEURL,
  PROY_FEURL: process.env.PROY_FEURL,
  PROY_EXTERNAL: process.env.PROY_EXTERNAL,

  ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
  ONE_SIGNAL_API_KEY: process.env.ONE_SIGNAL_API_KEY,

  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

  PROY_CRM_BD: process.env.PROY_CRM_BD, 
  SECRETIDENTIFIER: process.env.SECRETIDENTIFIER, 
  SECRETHIDDENKEY:  process.env.SECRETHIDDENKEY || '',
  PRONOSBEURL:  process.env.PRONOSBEURL,
};
