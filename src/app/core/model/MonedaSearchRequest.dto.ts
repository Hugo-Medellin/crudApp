export interface MonedaSearchRequest {
  numCia?: number;
  claveMoneda?: string;
  descripcion?: string;
  simbolo?: string;
  abreviacion?: string;
  monedaCorriente?: string;
  status?: string;
  [key: string]: string | number | undefined;
  }