const BASE_URL = 'https://api.frankfurter.dev/v2';

export class ApiError extends Error {
  constructor(tipo, mensagem) {
    super(mensagem);
    this.tipo = tipo;
  }
}

async function buscarJson(url) {
  let resposta;

  try {
    resposta = await fetch(url);
  } catch (e) {
    throw new ApiError('rede', 'Falha de conexão com a API.');
  }

  if (!resposta.ok) {
    throw new ApiError('http', `A API respondeu com erro (${resposta.status}).`);
  }

  try {
    return await resposta.json();
  } catch (e) {
    throw new ApiError('dados', 'A resposta da API não está em formato JSON.');
  }
}

export async function listarMoedas() {
  const dados = await buscarJson(`${BASE_URL}/currencies`);
  let moedas = [];

  if (Array.isArray(dados)) {
    moedas = dados
      .map((m) => ({
        codigo: m.iso_code || m.code || m.currency,
        nome: m.name || m.iso_code || m.code,
      }))
      .filter((m) => m.codigo);
  } else if (dados && typeof dados === 'object') {
    moedas = Object.keys(dados).map((codigo) => ({
      codigo,
      nome: typeof dados[codigo] === 'string' ? dados[codigo] : codigo,
    }));
  }

  if (moedas.length === 0) {
    throw new ApiError('dados', 'A API não retornou nenhuma moeda.');
  }

  moedas.sort((a, b) => a.codigo.localeCompare(b.codigo));
  return moedas;
}

export async function buscarTaxa(origem, destino) {
  const dados = await buscarJson(`${BASE_URL}/rate/${origem}/${destino}`);

  const taxa = Number(dados && dados.rate);
  if (!dados || !dados.date || !Number.isFinite(taxa) || taxa <= 0) {
    throw new ApiError('dados', 'A API não retornou a taxa esperada.');
  }

  return { taxa, data: dados.date };
}
