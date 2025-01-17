export class Paginacion {
  sort?: string = 'id.numCia,asc';
  page?: number = 0;
  size?: number = 2;
  [key: string]: string | number | undefined;
}

export interface PaginacionDto {
  sort?: string;
  page?: number;
  size?: number;
}