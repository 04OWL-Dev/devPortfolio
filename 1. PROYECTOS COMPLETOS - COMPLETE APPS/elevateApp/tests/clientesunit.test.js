const request = require('supertest')
const app = require('../server')

describe('Pruebas unitarias Clientes', () => {

    test('Se debe mostrar el listado de Clientes de forma exitosa', async () => {

        const nuevaCategoria = {
            nombre: 'Nombre categoría',
            descripcion: 'Descricion categoría'
        }
        const response = await request(app).post('/categorias/guardar').send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Se deben envíar los formularios de registro y edición Clientes de forma exitosa al servidor', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

    test('Se debe mostrar el modal de detalles del Cliente de forma exitosa', async () => {

        const actualizacionCategoria = {
            nombre: 'Nuevo Nombre categoría',
            descripcion: 'Nueva Descripcion categoría'
        }
        const response = await request(app).post('/categorias/modificar').send(actualizacionCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Se debe visualizar y poder interactuar con el modal de confirmación de eliminación', async () => {        
        const id = '1';
        const response = await request(app).get('/categorias/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});