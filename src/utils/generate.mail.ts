import nodemailer, { SentMessageInfo } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import config from "../config/environments/index";
import axios from "axios";


export const sendEmail = async ({
  //*Depredaco
  template,
  to,
  title,
  content,
}: {
  template: string;
  to: string;
  title: string;
  content: object;
}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "../templates/", template),
      (err, data: Buffer) => {
        if (err) reject(err);
        const source = data.toString();
        const template_handlebars = handlebars.compile(source);
        const mailBody = template_handlebars(content);
        const transporter = nodemailer.createTransport({
          service: config.SEND_TRANSPORTER,
          auth: {
            user: config.SENDER,
            pass: config.SENDER_PASS,
          },
        });
        const mailOptions = {
          from: config.SENDER_ALIAS, // sender address
          to: to, // list of receivers
          subject: title, // Subject line
          text: mailBody, // plaintext body
          html: mailBody, // html body
        };
        transporter.sendMail(
          mailOptions,
          function (err: Error | null, info: SentMessageInfo) {
            if (err) reject(err);
            resolve(info);
          }
        );
      }
    );
  });
};

export const sendMailAxios = async ({
  to,
  title,
  template,
}: {
  to: string;
  title: string;
  template: string;
}) => {
  try {
    return await axios({
      url: "https://api.sendgrid.com/v3/mail/send",
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.SENDGRID_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "noreply@misolucioneswow.com" },
        subject: title,
        content: [{ type: "text/html", value: template }],
      },
    });
  } catch (err) {
    console.log(err);
    
    throw err;
  }
};
