import path from "path";

export interface Development {
  PORT?: string;
  MODE: string;
  PROY_BD?: string;
  PROY_BD_HOST?: string;
  PROY_BD_USER?: string;
  PROY_BD_PASS?: string;
  PROY_BD_PORT?: string;
  SECRET_HIDDEN_KEY?: string;
  SEND_TRANSPORTER?: string;
  SENDER?: string;
  SENDER_PASS?: string;
  SENDER_ALIAS?: string;
  DIR: string;
  PROY_CRM_BD?: string;
  CLIENT_ID?: string;
  SENDGRID_KEY?: string;
  PROY_BEURL?: string;
  PROY_FEURL?: string;
  SECRETIDENTIFIER?: string;
  SECRETHIDDENKEY?: string;
  PRONOSBEURL?: string;
  PROY_EXTERNAL?: string;
  DIR_ASSETS?: string;

  ONE_SIGNAL_APP_ID?: string;
  ONE_SIGNAL_API_KEY?: string;

  // S3
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  S3_ENDPOINT_URL?: string;
  S3_BUCKET_NAME?: string;

}

export const development: Development = {
  MODE: "ENVIRONMENT",

  PORT: process.env.PROY_APP_PORT,

  PROY_BD: process.env.PROY_BD,
  PROY_BD_HOST: process.env.PROY_BD_HOST,
  PROY_BD_USER: process.env.PROY_BD_USER,
  PROY_BD_PASS: process.env.PROY_BD_PASS,
  PROY_BD_PORT: process.env.PROY_BD_PORT,

  SECRET_HIDDEN_KEY: process.env.SECRET_HIDDEN_KEY,

  SEND_TRANSPORTER: process.env.SEND_TRANSPORTER,
  SENDER: process.env.SENDER,
  SENDER_PASS: process.env.SENDER_PASS,
  SENDER_ALIAS: process.env.SENDER_ALIAS,

  CLIENT_ID: process.env.CLIENT_ID,

  DIR: path.join(__dirname, "../../"),
  DIR_ASSETS: path.join(__dirname, "../../", "assets"),
  SENDGRID_KEY: process.env.SENDGRID_KEY,

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
    SECRETHIDDENKEY:  process.env.SECRETHIDDENKEY,
    PRONOSBEURL:  process.env.PRONOSBEURL,
};
