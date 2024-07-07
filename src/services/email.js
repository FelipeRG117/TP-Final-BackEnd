const nodemailer = require("nodemailer");
//vamos a importar los env con dotenv que ya tenemos configurado
require("dotenv").config();

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmación de compra",
        html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }

  async enviarCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Restablecimiento de Contraseña",
        html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
  }

  //aqui hay que crar de producto eliminado a admin
  async deleteProductAdmin(name, apellido, product) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "aviso de eliminacion producto de admin",
        html: `<h1>Aviso de eliminacion de contraseña </h1>
                <h2>Admin ${name} ${apellido} </h2>
                <p>Tenemos que decirte que el producto ${product} a sido  borrado de la tienda</p>
                `,
      };
    } catch (error) {
      console.log("hubo un error en enviar correo email", error);
    }
  }
}

module.exports = EmailManager;
