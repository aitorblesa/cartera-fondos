const BASE = "https://servicios.ine.es/wstempus/js/ES";

export interface IneDataRow {
  Anyo: number;
  Periodo: string;
  Valor: number;
  Secreto: boolean;
}

export interface IneSeriesResponse {
  Data: IneDataRow[];
}

export async function fetchSerie(
  seriesCode: string,
  nult = 1,
): Promise<IneDataRow[]> {
  const res = await fetch(`${BASE}/DATOS_SERIE/${seriesCode}?nult=${nult}`);
  if (!res.ok) throw new Error(`INE API error ${res.status}`);
  const json: IneSeriesResponse = await res.json();
  if (!json.Data?.length) throw new Error(`Sin datos para serie ${seriesCode}`);
  return json.Data;
}
