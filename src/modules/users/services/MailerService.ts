import nodemailer from "nodemailer";

async function sendAuthEmail(email: string, token: string): Promise<void> {
  // Cria o transporte SMTP usando as credenciais fornecidas
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey", // Usar 'apikey' como nome de usuário
      pass: `${process.env.SENDGRID}`, // Substitua por sua chave de API do SendGrid
    },
  });

  // Define as opções do e-mail

  const mailOptions = {
    from: "testeexemplo582@gmail.com", // Email verificado no SendGrid
    to: `${email}`, // Email do destinatário
    subject: "Confirme seu email!",
    text: `Este é o seu código de confirmação, faça uma requisição na rota auth como,\n"code": "${token}",\n para autenticar sua conta.`,
  };

  try {
    // Envia o e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: ", info.response);
  } catch (error) {
    console.error("Erro ao enviar o e-mail: ", error);
  }
}

export default sendAuthEmail;
