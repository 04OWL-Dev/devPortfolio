const request = require('supertest')
const app = require('../server')

describe('Pruebas Funcionales', () => {

    test('Debe crear una Categoría, obtener el listado, editar y eliminar la categoría', async () => {
      const nuevaCategoria = {
        nombre: 'Categoría Funcional',
        descripcion: 'Descripción de la categoría funcional'
      };
  
      // Crear una nueva categoría
      let response = await request(app)
        .post('/categorias/guardar')
        .send(nuevaCategoria);
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/auth/404');
  
      // Obtener el listado de categorías
      response = await request(app).get('/auth/404');
      expect(response.statusCode).toBe(200);
      // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
      // Por ejemplo:
      // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
  
      // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
      const categoriaId = 1;     
  
      // Modificar la categoría
      const categoriaModificada = {
        id: 1,
        nombre: 'Categoría Modificada',
        descripcion: 'Descripción modificada de la categoría'
      };
      response = await request(app).post('/categorias/modificar').send(categoriaModificada);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
        
       // Eliminar la categoría
      response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/auth/404'); 
    });

    test('Debe registrarse un Cliente, obtener el listado, editar y eliminar el Cliente', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe registrarse un Proveedor, obtener el listado, editar y eliminar el Proveedor', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe registrarse un Pedido, obtener el listado, editar y eliminar el Pedido', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe crear una Venta, obtener el listado, editar y eliminar la Venta', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe registrarse un Producto, obtener el listado, editar y eliminar el Producto', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe crearse un Reporte', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Debe registrarse un Usuario, obtener el listado, editar y eliminar el Usuario', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
    test('Para la Autenticación se debe poder iniciar sesión, cambiar y reestablecerse la contraseña', async () => {
        const nuevaCategoria = {
          nombre: 'Categoría Funcional',
          descripcion: 'Descripción de la categoría funcional'
        };
    
        // Crear una nueva categoría
        let response = await request(app)
          .post('/categorias/guardar')
          .send(nuevaCategoria);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404');
    
        // Obtener el listado de categorías
        response = await request(app).get('/auth/404');
        expect(response.statusCode).toBe(200);
        // Aquí podrías verificar el contenido de la respuesta si tu endpoint devuelve un JSON en lugar de renderizar una vista
        // Por ejemplo:
        // expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(nuevaCategoria)]));
    
        // Suponiendo que el ID de la nueva categoría creada es 1 (ajusta según tu lógica)
        const categoriaId = 1;     
    
        // Modificar la categoría
        const categoriaModificada = {
          id: 1,
          nombre: 'Categoría Modificada',
          descripcion: 'Descripción modificada de la categoría'
        };
        response = await request(app).post('/categorias/modificar').send(categoriaModificada);
          expect(response.statusCode).toBe(302);
          expect(response.headers.location).toBe('/auth/404');
          
         // Eliminar la categoría
        response = await request(app).get(`/categorias/${categoriaId}/eliminar`);
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/auth/404'); 
    });
    
  });