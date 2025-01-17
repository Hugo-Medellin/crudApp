export class Paginacion {
  sort: string;
  page: number;
  size: number;
  [key: string]: string | number | undefined;

  constructor(sort: string, page: number, size: number) {
    this.sort = sort;
    this.page = page;
    this.size = size;
  }
}

export interface PaginacionDto {
  sort?: string;
  page?: number;
  size?: number;
}