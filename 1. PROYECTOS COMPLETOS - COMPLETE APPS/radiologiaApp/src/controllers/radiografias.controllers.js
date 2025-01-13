import radiografias from "../models/radiografias.models.js";
import tipos from "../models/tipos.models.js";
import tecnicas from "../models/tecnicas.models.js";

const radiografiasControllers = {
  listarRadiografias: async (usuario) => {
    try {
      const listado = await radiografias.listarRadiografias(usuario);
      return listado
    } catch (error) {
      console.log(`Error en el controlador 'listarRadiografias' ${error.message}`)
    }
  },
  datosEncabezado: async () => {
    try {
      let fechaActual = new Date()//Se almacena la fecha completa. 
      const dia = String(fechaActual.getDate()).padStart(2, 0)//padStart rellena caracteres al principio, de la cadena, añade ceros a la izq.
      const mes = String(fechaActual.getMonth() + 1).padStart(2, 0)
      const anio = String(fechaActual.getFullYear()).padStart(2, 0)
      fechaActual = `${dia}/${mes}/${anio}`;
      const tiposZonas = await tipos.tiposZonas()
      const listaTecnicas = await tecnicas.obtenerTecnicas()
      const respuesta = { fechaActual, tiposZonas, listaTecnicas }
      return respuesta;
    } catch (error) {
      console.log(`Error en el controlador 'obtenerFecha' ${error.message}`)
    }
  },
  guardarRadiografia: async (tipo_radiografia_id, paciente_id, tecnica_radiografia_id, estado_id, zona_radiografia_id, cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes) => {
    try {
      const radiografia = await radiografias.guardarRadiografia(parseInt(tipo_radiografia_id), paciente_id ? parseInt(paciente_id) : null, parseInt(tecnica_radiografia_id), parseInt(estado_id), parseInt(zona_radiografia_id), cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes);
      return radiografia
    } catch (error) {
      console.log(`Error en el controlador 'guardarRadiografia' ${error.message}`)
      throw error
    }
  },
  obtenerRadiografia: async (id) => {
    try {
      const radiografia = await radiografias.obtenerRadiografía(parseInt(id))
      return radiografia;
    } catch (error) {
      console.log(`Error en el controlador 'obtenerRadiografia' ${error.message}`)
    }
  },
  modificarRadiografia: async (radiografia_id, tipo_radiografia_id, paciente_id, tecnica_radiografia_id, estado_id, zona_radiografia_id, cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes) => {
    try {
      const radiografia = await radiografias.modificarRadiografia(parseInt(radiografia_id), parseInt(tipo_radiografia_id), paciente_id ? parseInt(paciente_id) : null, parseInt(tecnica_radiografia_id), parseInt(estado_id), parseInt(zona_radiografia_id), cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes)
      return radiografia
    } catch (error) {
      console.log(`Error en el controlador 'modificarRadiografia' ${error.message}`)
      throw error
    }
  },
  introducirInforme: async (id, estado, informe, hallazgos, observaciones) => {
    try {
      const insercion = await radiografias.introducirInforme(parseInt(id), parseInt(estado), informe, hallazgos, observaciones)
      return insercion
    } catch (error) {
      console.log(`Error en el controlador 'introducirInforme' ${error.message}`)
      throw error
    }
  },
  actualizarEstado: async (id, estado) => {
    try {
      const actualizacion = await radiografias.actualizarEstado(parseInt(id), parseInt(estado))
      return actualizacion;
    } catch (error) {
      console.log(`Error en el controlador 'actualizarEstado' ${error.message}`)
      throw error
    }
  },
  introducirObservacion: async (id, estado, observaciones) => {
    try {
      const actualizacion = await radiografias.introducirObservacion(parseInt(id), parseInt(estado), observaciones)
      return actualizacion;
    } catch (error) {
      console.log(`Error en el controlador 'introducirObservacion' ${error.message}`)
      throw error
    }
  },
}
export default radiografiasControllers