import usuarios from "../models/usuarios.models.js";
import brevo from '@getbrevo/brevo'
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    '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'
)
const usuariosControllers = {
    validarUsuario: async (user,password) => {
        try {
            const validacion = await usuarios.validarUsuario(user, password);
            return validacion
        } catch (error) {
            console.log(`Error en el controlador 'validarUsuario' ${error.message}`)
        }
    }, 
    asignarSesion: async (req,id, nombre, user,password,email,tipo_usuario) => {
        try {
            req.session.user = {
                id: id,
                nombre: nombre,
                user: user,
                password: password, 
                email: email, 
                tipo_usuario: tipo_usuario
            }//No es necesario retornarlo, va directamente al servidor.
        } catch (error) {
            console.log(`Error en el controlador 'asignarSesion' ${error.message}`)
        }
    }, 
    obtenerUsuarios: async () => {
        try {
            const consulta = await usuarios.obtenerUsuarios();
            return consulta;
        } catch (error) {
            console.log(`Error en el controlador 'obtenerUsuarios' ${error.message}`)
        }
    },
    cambiarContrasena: async (id,contraseñaNueva) => {
        try {
            console.log(id)
            console.log(contraseñaNueva)
            const contrasena = await usuarios.cambiarContrasena(parseInt(id), contraseñaNueva);
            return contrasena;
        } catch (error) {
            console.log(`Error en el controlador 'cambiarContrasena' ${error.message}`)
        }
    }, 
    recuperarContrasena: async (email) => {
        try {
            const cambio = await usuarios.recuperarContrasena(email);
            console.log(cambio)
            const sendSmtpEmail = new brevo.SendSmtpEmail()
            sendSmtpEmail.subject = 'Recuperar contraseña SYSCOR'
            sendSmtpEmail.to = [
                {email: email}
            ]
            sendSmtpEmail.sender = {
                name: 'SYSCOR Support',
                email: 'luisfreites83@gmail.com'
            }
            sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <main style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center;">Recuperar Contraseña</h2>
                        <p style="color: #555;">Estimado usuario,</p>
                        <p style="color: #555;">
                            Hemos recibido una solicitud para restablecer su contraseña. A continuación, encontrará su nueva contraseña temporal:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 18px; letter-spacing: 1px;">
                            ${cambio.password}
                            </span>
                        </div>
                        <p style="color: #555;">
                            Le recomendamos que ingrese a su cuenta y cambie esta contraseña temporal por una nueva de su elección lo antes posible.
                        </p>
                    </main>
                    <footer style="text-align: center; color: #777; margin-top: 20px; font-size: 12px;">
                    <p>&copy; 2024 SYSCOR. Todos los derechos reservados.</p>
                    </footer>
                </div>
                `;
            const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.log(`Error en el controlador 'recuperarContrasena' ${error.message}`)
            throw error
        }
    }

}
export default usuariosControllers