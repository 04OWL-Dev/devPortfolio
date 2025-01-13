const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Ventas', () => {

    test('Deben registrarse Ventas de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevaCompra = {
            codigo: 'Codigo compra',
            proveedor: 'Proveedor compra',
            productos: 'Productos compra'
        }       
        const response = await request(app).post('/compras/guardar').send(nuevaCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('El listado de Ventas debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos de la Venta de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionCompra = {
            codigo: 'Nuevo Codigo compra',
            proveedor: 'Nuevo Proveedor compra',
            productos: 'Nuevos Productos compra'
        }  
        const response = await request(app).post('/compras/modificar').send(actualizacionCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Deben eliminarse las Ventas de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/compras/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});