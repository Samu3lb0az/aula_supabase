// src/screens/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import supabase from '../../supabaseConfig';
import 'react-native-url-polyfill/auto';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (authError) {
        if (authError.status === 400 && authError.message.includes('Invalid')) {
          Alert.alert('Erro', 'Usuário não encontrado ou senha incorreta');
        } else if (authError.status === 400 && authError.message.includes('confirm')) {
          Alert.alert('Erro', 'E-mail não confirmado. Verifique sua caixa de entrada.');
        } else {
          throw authError;
        }
        return;
      }
      const userId = authData.user.id;
      const { data: perfil, error: perfilError } = await supabase
        .from('users')
        .select('nome_user, photoUrl_user')
        .eq('id_user', userId)
        .maybeSingle();
      if (perfilError) {
        console.warn(perfilError);
      }
      navigation.replace('Inicio', {
        nome: perfil?.nome_user ?? '',
        photoUrl: perfil?.photoUrl_user ?? '',
        userId,
      });
    } catch (err) {
      console.warn(err);
      Alert.alert('Erro', err.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bem-vindo de volta 👋</Text>
        <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Entrar</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>
            Não tem uma conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    fontSize: 16,
    color: '#111827'
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15
  },
  linkHighlight: {
    color: '#2563EB',
    fontWeight: '600'
  }
});
