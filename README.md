# CrudApp

Proyecto generado en Angular versión 17.3.0.

Crud básico que consume microservicio de [Repositorio: ms-moneda](https://github.com/Hugo-Medellin/ms-moneda)

## Características
- Muestra de registros en tabla.
- Creación de nuevos registros.
- Consulta de registros, mediante formulario.
- Actualización de registros mediante formulario que se abre en un modal.
- Eliminación de registros, con modal de confirmación.
- Manejo de paginación en consulta.

- Utilización de SweetAlert2
- Utilización bootstrap 5

## Ejecución de proyecto con repositorio clonado.
git clone https://github.com/Hugo-Medellin/crudApp.git
cd crudApp
npm install
ng serve

Navegar a `http://localhost/crud/`.

Para esto debe de estar funcionando el [Repositorio: ms-moneda](https://github.com/Hugo-Medellin/ms-moneda)

## Ejecución de proyecto con docker-compose
- Ejecutar docker-compose.yml desde la ruta raiz de donde se encuentra el archivo.

Con el siguiente comando.
`docker-compose up -d`
