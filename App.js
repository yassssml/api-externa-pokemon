import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

export default function App() {
  const [nome, setNome] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  async function buscarPersonagem() {
    if (nome.trim().length === 0) {
      Alert.alert('Nome inválido', 'Digite o nome do personagem.');
      return;
    }

    setPokemon(null);
    setLoading(true);

    try {
      const base = 'https://pokeapi.co/api/v2/pokemon';
      const nomeLower = nome.trim().toLowerCase();
      const url = `${base}/${encodeURIComponent(nomeLower)}`;
      const resposta = await fetch(url);
      if (!resposta.ok) {
        Alert.alert('Não encontrado', 'Pokémon não encontrado. Verifique o nome.');
        setLoading(false);
        return;
      }
      const dados = await resposta.json();

      setPokemon(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível conectar. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  function renderPokemon() {
    if (!pokemon) return null;
    const types = pokemon.types?.map(t => t.type.name).join(', ');
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.meta}>Tipos: {types}</Text>
        <Text style={styles.meta}>Altura: {pokemon.height}</Text>
        <Text style={styles.meta}>Peso: {pokemon.weight}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🔎 Busca Personagem</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do personagem"
        value={nome}
        onChangeText={setNome}
        returnKeyType="search"
      />

      <TouchableOpacity style={styles.botao} onPress={buscarPersonagem}>
        <Text style={styles.botaoTexto}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#8a15c0" style={{ marginTop: 16 }} />}

      {renderPokemon()}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  botao: { 
    backgroundColor: '#7a26be', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 12,
    width: '100%'
  },
  botaoTexto: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  list: { 
    marginTop: 8,
    width: '100%'
  },
  card: { 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  name: { 
    fontSize: 20, 
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: { 
    color: '#333',
    fontSize: 16,
    marginBottom: 4,
  },
});
