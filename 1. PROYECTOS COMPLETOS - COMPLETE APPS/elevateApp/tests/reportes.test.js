const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Reportes', () => {

    test('Deben generarse Reportes de forma exitosa', async () => {

        const nuevaCompra = {
            codigo: 'Codigo compra',
            proveedor: 'Proveedor compra',
            productos: 'Productos compra'
        }       
        const response = await request(app).post('/compras/guardar').send(nuevaCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});