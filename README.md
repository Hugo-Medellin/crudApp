# CrudApp

Proyecto generado en Angular versión 17.3.0.

Crud básico que consume microservicio de ms-moneda `https://github.com/Hugo-Medellin/ms-moneda`

## Características
- Muestra de registros en tabla.
- Creación de nuevos registros.
- Consulta de registros, mediante formulario.
- Actualización de registros mediante formulario que se abre en un modal.
- Eliminación de registros, con modal de confirmación.
- Manejo de paginación en consulta.

- Utilización de SweetAlert2
- Utilización bootstrap 5

## Ejecución de proyecto mediante comandos.
- Instalación de dependencias después de clonación de repositorio. Con comando `npm install`
- Ejecución de servidor con comando `ng serve`. Navegar a `http://localhost/crud/`.

## Ejecución de proyecto con docker-compose
- Creación de archivo docker-compose.yml
- Pegar el siguiente código

version: '3.9'
services:
  ### MS MONEDA Spring boot 3
  ms-moneda:
    container_name: ms-moneda
    image: vhmm/ms-moneda:latest
    restart: always
    ports:
      - 8080:8080
    networks:
      - venture-net
  
  ### Crud App Angular 17
  crupApp:
    container_name: crudapp
    image: vhmm/crudapp:latest
    restart: always
    depends_on:
      - ms-moneda
    ports:
      - 80:80
    networks:
      - venture-net

networks:
  venture-net:
    driver: bridge
