import { fetchSerie } from "./client";

// Índice general nacional · Variación anual (tabla 76125)
const IPC_ANUAL = "IPC290750";

export async function getIPCAnual(): Promise<number> {
  const [row] = await fetchSerie(IPC_ANUAL);
  return row.Valor;
}
