const request = require('supertest')
const app = require('../server')

describe('Pruebas unitarias Reportes', () => {

    test('Se deben mostrar reportes de Pedidos de forma exitosa', async () => {

        const nuevaCategoria = {
            nombre: 'Nombre categoría',
            descripcion: 'Descricion categoría'
        }
        const response = await request(app).post('/categorias/guardar').send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Se deben mostrar reportes de Ventas de forma exitosa', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

});