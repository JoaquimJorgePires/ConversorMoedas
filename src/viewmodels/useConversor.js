import { useState, useEffect, useRef } from 'react';
import { listarMoedas, buscarTaxa } from '../models/moedaModel';

const MOEDAS_PERMITIDAS = ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CAD'];

function converterTextoParaNumero(texto) {
  const limpo = texto.trim();
  if (!/^\d+([.,]\d+)?$/.test(limpo)) return null;
  return Number(limpo.replace(',', '.'));
}

function formatarDinheiro(valor, moeda) {
  try {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: moeda });
  } catch (e) {
    return `${valor.toFixed(2)} ${moeda}`;
  }
}

function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function useConversor() {
  const [valor, setValor] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [moedas, setMoedas] = useState([]);
  const [carregandoMoedas, setCarregandoMoedas] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [resultado, setResultado] = useState(null);
  const ultimaRequisicao = useRef(0);

  async function carregarMoedas() {
    setCarregandoMoedas(true);
    setErroApi('');
    try {
     const listaApi = await listarMoedas();

     const filtrada = listaApi.filter((m) => MOEDAS_PERMITIDAS.includes(m.codigo));
     const lista = filtrada.length >= 2 ? filtrada : listaApi;
      setMoedas(lista);

      const codigos = lista.map((m) => m.codigo);
      setOrigem(codigos.includes('USD') ? 'USD' : codigos[0]);
      setDestino(codigos.includes('BRL') ? 'BRL' : codigos[1] || codigos[0]);
    } catch (e) {
      setErroApi('Não foi possível carregar as moedas. Verifique sua conexão e tente novamente.');
    } finally {
      setCarregandoMoedas(false);
    }
  }

  useEffect(() => {
    carregarMoedas();
  }, []);

  function limparMensagens() {
    setErroValidacao('');
    setErroApi('');
  }

  function alterarValor(texto) {
    setValor(texto);
    limparMensagens();
  }

  function alterarOrigem(codigo) {
    setOrigem(codigo);
    limparMensagens();
  }

  function alterarDestino(codigo) {
    setDestino(codigo);
    limparMensagens();
  }

  function inverterMoedas() {
    setOrigem(destino);
    setDestino(origem);
    limparMensagens();
  }

  function validar() {
    if (valor.trim() === '') return 'Digite o valor que deseja converter.';

    const numero = converterTextoParaNumero(valor);
    if (numero === null) return 'Valor inválido. Use apenas números, por exemplo 10,50.';
    if (numero <= 0) return 'O valor precisa ser maior que zero.';
    if (!origem) return 'Selecione a moeda de origem.';
    if (!destino) return 'Selecione a moeda de destino.';
    if (origem === destino) return 'Escolha moedas diferentes para converter.';
    return '';
  }

  async function converter() {
    if (carregando) return; 

    limparMensagens();
    setResultado(null); 

    const mensagem = validar();
    if (mensagem) {
      setErroValidacao(mensagem);
      return;
    }

    const numero = converterTextoParaNumero(valor);
    const idDessaRequisicao = ++ultimaRequisicao.current;
    setCarregando(true);

    try {
      const { taxa, data } = await buscarTaxa(origem, destino);

      if (idDessaRequisicao !== ultimaRequisicao.current) return;

      const convertido = numero * taxa;

      setResultado({
        valorOriginal: formatarDinheiro(numero, origem),
        valorConvertido: formatarDinheiro(convertido, destino),
        origem,
        destino,
        taxa: taxa.toLocaleString('pt-BR', { maximumFractionDigits: 6 }),
        data: formatarData(data),
      });
    } catch (e) {
      if (idDessaRequisicao !== ultimaRequisicao.current) return;

      if (e.tipo === 'rede') {
        setErroApi('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
      } else if (e.tipo === 'http') {
        setErroApi('O serviço de câmbio não respondeu corretamente. Tente novamente em instantes.');
      } else {
        setErroApi('Não foi possível obter a taxa de câmbio para essas moedas.');
      }
    } finally {
      if (idDessaRequisicao === ultimaRequisicao.current) {
        setCarregando(false);
      }
    }
  }

  return {
    valor,
    origem,
    destino,
    moedas,
    carregandoMoedas,
    carregando,
    erroValidacao,
    erroApi,
    resultado,
    alterarValor,
    alterarOrigem,
    alterarDestino,
    inverterMoedas,
    converter,
    carregarMoedas,
  };
}
