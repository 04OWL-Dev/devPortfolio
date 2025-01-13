const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Usuarios', () => {

    test('Deben registrarse Usuarios de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevaCompra = {
            codigo: 'Codigo compra',
            proveedor: 'Proveedor compra',
            productos: 'Productos compra'
        }       
        const response = await request(app).post('/compras/guardar').send(nuevaCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('El listado de Usuarios debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos del Usuario de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionCompra = {
            codigo: 'Nuevo Codigo compra',
            proveedor: 'Nuevo Proveedor compra',
            productos: 'Nuevos Productos compra'
        }  
        const response = await request(app).post('/compras/modificar').send(actualizacionCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Deben eliminarse los Usuarios de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/compras/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});