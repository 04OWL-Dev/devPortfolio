const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Proveedores', () => {

    test('Deben crearse Proveedores de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevoProveedor = {
            razonSocial: 'Razon Social proveedor',
            rif: 'RIF proveedor',
            direccion: 'Dirección proveedor',
            web: 'Web proveedor',
            email: 'Email proveedor',
            banco: 'Banco proveedor',
            cuenta: 'Cuenta proveedor',
            telefono: 'Teléfono proveedor',            
        }
        const response = await request(app).post('/proveedores/guardar').send(nuevoProveedor);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/proveedores/lista');
    });

    test('El listado de Proveedores debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/proveedores/lista');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos del Proveedor de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionProveedor = {
            razonSocial: 'Nueva Razon Social proveedor',
            rif: 'NUevo RIF proveedor',
            direccion: 'Nueva Dirección proveedor',
            web: 'Nueva Web proveedor',
            email: 'Nuevo Email proveedor',
            banco: 'Nuevo Banco proveedor',
            cuenta: 'Nueva Cuenta proveedor',
            telefono: 'Nuevo Teléfono proveedor',            
        }
        const response = await request(app).post('/proveedores/modificar').send(actualizacionProveedor);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/proveedores/lista');
    });

    test('Deben eliminarse los Proveedores de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/proveedores/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/proveedores/lista');
    });

});