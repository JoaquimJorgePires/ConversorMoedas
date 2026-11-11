import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConversorView from './src/views/ConversorView';

export default function App() {
  return (
    <SafeAreaProvider>
      <ConversorView />
    </SafeAreaProvider>
  );
}