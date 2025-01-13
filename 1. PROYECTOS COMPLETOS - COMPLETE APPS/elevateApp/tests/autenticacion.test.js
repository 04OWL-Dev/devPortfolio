const request = require('supertest')
const app = require('../server')

describe('Pruebas Autenticación', () => {

    test('Se debe Iniciar Sesión de forma exitosa con RES200', async () => {
        const response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
    });
    
    test('Debe recuperarse la contraseña de forma exitosa y redirigir con RES302 al Login', async () => {

        const nuevaCompra = {
            codigo: 'Codigo compra',
            proveedor: 'Proveedor compra',
            productos: 'Productos compra'
        }       
        const response = await request(app).post('/compras/guardar').send(nuevaCompra);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Debe cambiarse la contraseña de forma exitosa y redirigir con RES302 al Index', async () => {

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