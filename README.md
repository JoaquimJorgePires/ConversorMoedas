# Conversor de Moedas

App mobile feito com React Native (Expo) e JavaScript, usando arquitetura MVVM e a API pública Frankfurter.

## Como instalar e executar

1. Instale o Node.js (versão LTS).
2. Crie o projeto e copie estes arquivos por cima:
   ```
   npx create-expo-app@latest ConversorMoedas --template blank
   cd ConversorMoedas
   npx expo install @react-native-picker/picker react-native-safe-area-context
   ```
3. Execute:
   ```
   npx expo start
   ```
4. Abra no celular com o app Expo Go (QR code) ou em um emulador (`a` para Android, `i` para iOS).

## Estrutura

- `src/models/moedaModel.js`: acesso à API (moedas e taxas)
- `src/viewmodels/useConversor.js`: estados, validações e conversão
- `src/views/ConversorView.js`: tela
- `App.js`: ponto de entrada

## Capturas de tela
<img width="763" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26 (1)" src="https://github.com/user-attachments/assets/a61618d7-66ce-4305-a1a5-abe48a988b20" />
<img width="764" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26 (2)" src="https://github.com/user-attachments/assets/83901ffc-3aac-4794-bc91-d63cdbe8a032" />
<img width="766" height="1599" alt="WhatsApp Image 2026-11-11 at 13 25 26 (3)" src="https://github.com/user-attachments/assets/362baed7-b77a-474b-877d-ade51336a3b2" />
<img width="764" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26 (4)" src="https://github.com/user-attachments/assets/ef844157-b4c0-4e07-90a4-2b04b02849ca" />
<img width="764" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26 (5)" src="https://github.com/user-attachments/assets/b398f5be-43c8-4873-9612-2a6db09540c7" />
<img width="763" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26 (6)" src="https://github.com/user-attachments/assets/b92f5c79-31c1-409f-a01c-d98e86d42645" />
<img width="771" height="1600" alt="WhatsApp Image 2026-11-11 at 13 25 26" src="https://github.com/user-attachments/assets/9e0bd424-d07c-48e8-8d35-94b0fe1248c0" />

## Testes realizados

- Carregamento inicial: OK
- Conversão válida (100 USD → EUR): OK
- Campo vazio: OK, mostra mensagem
- Valor zero/negativo: OK, conversão bloqueada
- Decimal com vírgula (10,50): OK
- Moedas iguais: OK, conversão bloqueada
- Falha de conexão: OK, mostra erro e permite tentar de novo
