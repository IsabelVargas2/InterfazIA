import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import Slider from '@react-native-community/slider';

export default function App() {
  const [pm10, setPm10] = useState(251);
  const [pm25, setPm25] = useState(156);
  const [temperatura, setTemperatura] = useState(20);
  const [humedad, setHumedad] = useState(50);
  const [resultado, setResultado] = useState(null);

  const predecir = async () => {
    try {
      const response = await fetch('http://192.168.1.20:8000/predict', {  // IP DE LA API 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pm10, pm2_5: pm25, temperatura, humedad })
      });

      const data = await response.json();
      let mensaje = "";

      switch (data.prediccion) {
        case 0: mensaje = "✅ Calidad del Aire: Buena"; break;
        case 1: mensaje = "❌ Calidad del Aire: Mala"; break;
        case 2: mensaje = "⚠️ Calidad del Aire: Regular"; break;
        default: mensaje = "🤷 Resultado desconocido"; break;
      }

      setResultado(mensaje);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con la API.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 ¡Prediga su Aire! 💨</Text>

      <Text style={styles.label}>🌫 PM10: {pm10}</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={500} step={1} value={pm10} onValueChange={setPm10} />

      <Text style={styles.label}>🌫 PM2.5: {pm25}</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={300} step={1} value={pm25} onValueChange={setPm25} />

      <Text style={styles.label}>🌡 Temperatura: {temperatura}°C</Text>
      <Slider style={styles.slider} minimumValue={-10} maximumValue={50} step={1} value={temperatura} onValueChange={setTemperatura} />

      <Text style={styles.label}>💧 Humedad: {humedad}%</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={100} step={1} value={humedad} onValueChange={setHumedad} />

      <Button title="🔍 Predecir Calidad del Aire" onPress={predecir} />

      {resultado && <Text style={styles.resultado}>{resultado}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30
  },
  label: {
    color: 'white',
    marginTop: 15
  },
  slider: {
    width: '100%',
    height: 40
  },
  resultado: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  }
});
