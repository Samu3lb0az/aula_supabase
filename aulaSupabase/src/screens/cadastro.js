// src/screens/cadastro.js

import React, { useState } from 'react';
import { 
  View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../../supabaseConfig';
import 'react-native-url-polyfill/auto';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [imagemUri, setImagemUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !imagemUri) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      // 1) Criar usuário no Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
      });
      if (signUpError) throw signUpError;
      const userId = signUpData.user.id;

      // 2) Preparar blob da imagem
      const response = await fetch(imagemUri);
      const blob = await response.blob();

      // 3) Detectar extensão e MIME
      const uriExt = imagemUri.split('.').pop().toLowerCase();
      const validExt = ['jpg','jpeg','png'].includes(uriExt) ? uriExt : 'jpg';
      const mimeType = validExt === 'png' ? 'image/png' : 'image/jpeg';

      const fileName = `${userId}_${Date.now()}.${validExt}`;
      const filePath = `perfil_imagem/${fileName}`;

      // 4) Upload para o bucket 'photo-perfil'
      const { error: uploadError } = await supabase
        .storage
        .from('photo-perfil')
        .upload(filePath, blob, { contentType: mimeType });
      if (uploadError) throw uploadError;

      // 5) Gerar URL pública
      const { data: publicData, error: urlError } = await supabase
        .storage
        .from('photo-perfil')
        .getPublicUrl(filePath);
      if (urlError) throw urlError;
      const publicUrl = publicData.publicUrl;

      // 6) Inserir no schema 'users'
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id_user: userId,
          nome_user: nome,
          email_user: email,
          photoUrl_user: publicUrl,
        }]);
      if (dbError) throw dbError;

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.replace('Login');
    } catch (err) {
      console.warn(err);
      Alert.alert('Erro', err.message || 'Não foi possível cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholderTextColor="#888"
        />

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

        {imagemUri && <Image source={{ uri: imagemUri }} style={styles.avatar} />}

        <TouchableOpacity style={styles.imageButton} onPress={escolherImagem}>
          <Text style={styles.imageButtonText}>
            {imagemUri ? 'Trocar Imagem' : 'Escolher Imagem'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Cadastrar</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>
            Já tem conta? <Text style={styles.linkHighlight}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#6EE7B7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15,
  },
  linkHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
