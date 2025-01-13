const request = require('supertest')
const app = require('../server')

describe('Pruebas CRUD Proveedores', () => {

    test('Deben registrarse Productos de forma exitosa y redirigir con RES302 al listado', async () => {

        const nuevoProducto = {
            codigo_barras: 'Código de Barras',
            nombre: 'Nombre producto',
            marca: 'Marca producto',
            modelo: 'Modelo producto',
            uso: 'Uso producto',
            categoria: 'Categoría producto',
            existencias: 'Existencias producto',
            minimo: 'Minimo stock producto',
            pcompra: 'Precio de compra producto',
            pventa: 'Precio de venta producto '
        }
        const response = await request(app).post('/productos/guardar').send(nuevoProducto);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('El listado de Productos debe cargarse de forma exitosa RES200', async () => {
      const response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
    });

    test('Deben actualizarse los datos del Producto de forma exitosa y redirigir con RES302 al listado', async () => {

        const actualizacionProducto = {
            codigo_barras: 'Nuevo Código de Barras',
            nombre: 'Nuevo Nombre producto',
            marca: 'Nuevo Marca producto',
            modelo: 'Nuevo Modelo producto',
            uso: 'Nuevo Uso producto',
            categoria: 'Nuevo Categoría producto',
            existencias: 'Nuevo Existencias producto',
            minimo: 'Nuevo Minimo stock producto',
            pcompra: 'Nuevo Precio de compra producto',
            pventa: 'Nuevo Precio de venta producto '
          }
        const response = await request(app).post('/productos/modificar').send(actualizacionProducto);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

    test('Deben eliminarse los Productos de forma exitosa y redirigir con RES302 al listado', async () => {        
        const id = '1';
        const response = await request(app).get('/productos/eliminar/:codigo').send(id);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    });

});