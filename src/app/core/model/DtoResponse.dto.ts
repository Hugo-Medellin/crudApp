export interface DtoResponse<T> {
    codigo_estatus: number;
	mensajes: string[];
	errores: string[];
	fecha_peticion: Date;
	contenido: T;
	paginacion: DtoPaginacionResponse;
}

export interface DtoPaginacionResponse {
    last: boolean;
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}