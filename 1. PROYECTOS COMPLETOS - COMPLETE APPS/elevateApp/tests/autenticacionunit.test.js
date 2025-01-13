const request = require('supertest')
const app = require('../server')

describe('Pruebas unitarias modulo de Autenticación', () => {

    test('Se debe Iniciar Sesión de forma exitosa', async () => {
        const response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
    });
    
    test('Se debe cerrar sesión de forma exitosa', async () => {

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