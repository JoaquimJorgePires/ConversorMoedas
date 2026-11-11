import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import useConversor from '../viewmodels/useConversor';

const LARANJA = '#F26B1D';
const LARANJA_ESCURO = '#D9540B';
const VERDE = '#2E9E5B';
const VERDE_CLARO = '#EAF7EE';
const AMARELO = '#FFC83D';
const TEXTO = '#2B3A33';
const FUNDO = '#F5FBF4';

function Linha({ icone, titulo, children }) {
  return (
    <View style={styles.linha}>
      <View style={styles.linhaCabecalho}>
        <Ionicons name={icone} size={34} color={VERDE} style={styles.icone} />
        <Text style={styles.linhaTitulo}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
}

function SeletorMoeda({ valor, moedas, onChange, desabilitado }) {
  return (
    <View style={styles.seletor}>
      <Picker
        selectedValue={valor}
        onValueChange={onChange}
        enabled={!desabilitado}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor={VERDE}
      >
        {moedas.map((m) => (
          <Picker.Item key={m.codigo} label={`${m.codigo} - ${m.nome}`} value={m.codigo} />
        ))}
      </Picker>
    </View>
  );
}

export default function ConversorView() {
  const vm = useConversor();

  return (
    <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.topo}>
        <Text style={styles.topoTitulo}>Conversor de Moedas</Text>
        <Ionicons name="menu-outline" size={30} color={LARANJA_ESCURO} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.conteudo}>
          <View style={styles.faixa}>
            <View style={styles.avatar}>
              <Ionicons name="cash-outline" size={36} color={LARANJA_ESCURO} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.faixaNome}>Câmbio</Text>
              <Text style={styles.faixaSub}>Taxas de referência • Frankfurter</Text>
            </View>
            <TouchableOpacity onPress={vm.inverterMoedas} disabled={vm.carregandoMoedas}>
              <Ionicons name="swap-vertical-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {vm.carregandoMoedas && (
            <View style={styles.aviso}>
              <ActivityIndicator color={VERDE} />
              <Text style={styles.avisoTexto}>Carregando moedas...</Text>
            </View>
          )}

          {!vm.carregandoMoedas && vm.moedas.length === 0 && (
            <View style={styles.aviso}>
              <Text style={styles.erro}>{vm.erroApi}</Text>
              <TouchableOpacity style={styles.botaoSecundario} onPress={vm.carregarMoedas}>
                <Text style={styles.botaoSecundarioTexto}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          {vm.moedas.length > 0 && (
            <>
              <Linha icone="wallet-outline" titulo="Valor">
                <TextInput
                  style={styles.input}
                  value={vm.valor}
                  onChangeText={vm.alterarValor}
                  placeholder="Ex: 100,00"
                  placeholderTextColor="#9AA8A0"
                  keyboardType="decimal-pad"
                />
              </Linha>

              <Linha icone="arrow-up-circle-outline" titulo="Moeda de origem">
                <SeletorMoeda
                  valor={vm.origem}
                  moedas={vm.moedas}
                  onChange={vm.alterarOrigem}
                  desabilitado={vm.carregando}
                />
              </Linha>

              <Linha icone="arrow-down-circle-outline" titulo="Moeda de destino">
                <SeletorMoeda
                  valor={vm.destino}
                  moedas={vm.moedas}
                  onChange={vm.alterarDestino}
                  desabilitado={vm.carregando}
                />
              </Linha>

              {vm.erroValidacao !== '' && <Text style={styles.validacao}>{vm.erroValidacao}</Text>}
              {vm.erroApi !== '' && <Text style={styles.erro}>{vm.erroApi}</Text>}

              <TouchableOpacity
                style={[styles.botao, vm.carregando && styles.botaoDesabilitado]}
                onPress={vm.converter}
                disabled={vm.carregando}
              >
                {vm.carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.botaoTexto}>Converter</Text>
                )}
              </TouchableOpacity>

              {vm.resultado && (
                <View style={styles.resultado}>
                  <Text style={styles.resultadoLabel}>
                    {vm.resultado.valorOriginal} ({vm.resultado.origem}) equivale a
                  </Text>
                  <Text style={styles.resultadoValor}>{vm.resultado.valorConvertido}</Text>
                  <View style={styles.resultadoDivisor} />
                  <Text style={styles.resultadoInfo}>
                    Taxa: 1 {vm.resultado.origem} = {vm.resultado.taxa} {vm.resultado.destino}
                  </Text>
                  <Text style={styles.resultadoInfo}>
                    Data de referência: {vm.resultado.data}
                  </Text>
                  <Text style={styles.resultadoNota}>
                    Taxa de referência, não é cotação em tempo real.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.rodape}>
        <View style={styles.ponto} />
        <View style={styles.ponto} />
        <View style={styles.ponto} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#fff' },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  topoTitulo: { fontSize: 18, fontWeight: '600', color: LARANJA_ESCURO },

  conteudo: { paddingBottom: 24, backgroundColor: FUNDO, flexGrow: 1 },

  faixa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LARANJA,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 16,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: AMARELO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faixaNome: { color: '#fff', fontSize: 18, fontWeight: '700' },
  faixaSub: { color: '#FFE8D6', fontSize: 12, marginTop: 2 },

  aviso: { alignItems: 'center', padding: 24, gap: 12 },
  avisoTexto: { color: TEXTO },

  linha: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBDD',
  },
  linhaCabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icone: { width: 44 },
  linhaTitulo: { fontSize: 14, color: TEXTO, fontWeight: '600' },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    color: TEXTO,
  },

  seletor: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: { color: TEXTO },

  validacao: {
    color: LARANJA_ESCURO,
    backgroundColor: '#FFF1E6',
    marginHorizontal: 24,
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  erro: {
    color: '#B3261E',
    backgroundColor: '#FDECEA',
    marginHorizontal: 24,
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },

  botao: {
    backgroundColor: VERDE,
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: '700' },

  botaoSecundario: {
    borderWidth: 1.5,
    borderColor: VERDE,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botaoSecundarioTexto: { color: VERDE, fontWeight: '600' },

  resultado: {
    backgroundColor: VERDE_CLARO,
    borderLeftWidth: 6,
    borderLeftColor: AMARELO,
    marginHorizontal: 24,
    marginTop: 22,
    padding: 18,
    borderRadius: 12,
  },
  resultadoLabel: { fontSize: 13, color: TEXTO },
  resultadoValor: { fontSize: 30, fontWeight: '800', color: VERDE, marginTop: 4 },
  resultadoDivisor: { height: 1, backgroundColor: '#CFE6D4', marginVertical: 12 },
  resultadoInfo: { fontSize: 13, color: TEXTO, marginBottom: 2 },
  resultadoNota: { fontSize: 11, color: '#6B7C72', marginTop: 8 },

  rodape: {
    height: 34,
    backgroundColor: VERDE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ponto: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' },
});
