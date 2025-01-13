const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Categorías', () => {

    test('Deben crearse Categorías de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevaCategoria = {
            nombre: 'Nombre categoría',
            descripcion: 'Descricion categoría'
        }
        const response = await request(app).post('/categorias/guardar').send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/categorias/lista');
    });

    test('El listado de Categorías debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/categorias/lista');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos de la Categoría de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionCategoria = {
            nombre: 'Nuevo Nombre categoría',
            descripcion: 'Nueva Descripcion categoría'
        }
        const response = await request(app).post('/categorias/modificar').send(actualizacionCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/categorias/lista');
    });

    test('Deben eliminarse las Categorías de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/categorias/:codigo/eliminar').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/categorias/lista');
    });

});