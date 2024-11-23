import nodemailer from "nodemailer";
import path from "path";

// Definindo o transporte com Mailgun
const transport = nodemailer.createTransport({
  host: "smtp.mailgun.org", // Host do Mailgun
  port: 587, // Porta padrão para SMTP seguro
  auth: {
    user: "postmaster@auth.domain.com", // API Key do Mailgun ou SMTP username
    pass: "&r2$*Sx%A2*#*9", // SMTP password
  },
});

async () => {
  try {
    // Importando dinamicamente o nodemailer-express-handlebars
    const hbs = (await import("nodemailer-express-handlebars")).default;

    // Usando o HBS para configurar o transport
    transport.use(
      "compile",
      hbs({
        viewEngine: {
          defaultLayout: undefined,
          partialsDir: path.resolve("./src/modules"),
        },
        viewPath: path.resolve("./src/modules"),
        extName: ".html",
      })
    );
  } catch (error) {
    console.error("Erro ao importar nodemailer-express-handlebars:", error);
  }
};

export const sendAuthEmail = async (
  to: string,
  token: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: "postmaster@auth.domain.com", // Insira um domínio configurado no Mailgun
      to,
      subject: "Ative sua conta",
      template: "authEmail",
      context: {
        token,
      },
    };

    await transport.sendMail(mailOptions);
    console.log("E-mail de autenticação enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar e-mail de autenticação", error);
  }
};
