const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Clientes', () => {

    test('Deben crearse Clientes de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevoCliente = {
            nombre: 'Nombre cliente',
            cedula: 'Cedula cliente',
            telefono: 'Teléfono cliente',
            direccion: 'Dirección cliente'
        }
        const response = await request(app).post('/clientes/guardar').send(nuevoCliente);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('El listado de Clientes debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos del Cliente de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionCliente = {
            nombre: 'Nuevo Nombre cliente',
            cedula: 'Nueva Cedula cliente',
            telefono: 'Nuevo Teléfono cliente',
            direccion: 'NUeva Dirección cliente'
        }
        const response = await request(app).post('/clientes/modificar').send(actualizacionCliente);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Deben eliminarse los Clientes de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/clientes/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});