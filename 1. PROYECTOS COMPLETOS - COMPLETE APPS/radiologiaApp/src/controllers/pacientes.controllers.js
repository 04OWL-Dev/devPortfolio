import pacientes from "../models/pacientes.models.js";
const pacientesControllers = {
    listarPacientes: async (req,res) => {
        try {
            const listado = await pacientes.listarPacientes();
            res.json(listado)
        } catch (error) {
            console.log(`Error en el controlador 'listarPacientes' ${error.message}`)
        }
    },
    autocompletePacientes: async (cedula) => {
        try {
            const autocomplete = await pacientes.autocompletePacientes(cedula);
            return autocomplete;
        } catch (error) {
            console.log(`Error en el controlador 'autocompletePacientes' ${error.message}`)
        }    
    },
    registrarPaciente: async (cedula, nombre, apellido, telefono, direccion) => {
        try {
            const paciente = await pacientes.registrarPaciente(cedula, nombre, apellido, telefono, direccion);
            return paciente;
        } catch (error) {
            console.log(`Error en el controlador 'registrarPaciente' ${error.message}`)
        }
    }, 
    modificarPaciente: async (id,nombre, apellido, cedula, telefono, direccion) => {
        try {
            const paciente = await pacientes.modificarPaciente(id,nombre,apellido,cedula,telefono,direccion)
        } catch (error) {
            console.log(`Error en el controlador 'modificarPaciente' ${error.message}`)
        }
    }, 
    obtenerPaciente: async (id) => {
        try {
            const paciente = await pacientes.obtenerPaciente(id)
            return paciente
        } catch (error) {
            console.log(`Error en el controlador 'obtenerPaciente' ${error.message}`)
        }
    }
}
export default pacientesControllers;