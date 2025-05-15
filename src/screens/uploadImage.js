import React, { useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../../supabaseConfig';
import 'react-native-url-polyfill/auto';

export default function UploadImagem() {
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const selecionarImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0]);
    }
  };

  const uploadImagem = async () => {
    if (!imagem) return;

    try {
      setCarregando(true);
      const response = await fetch(imagem.uri);
      const blob = await response.blob();
      const nomeArquivo = `${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('bucket-storage-senai-29/perfil_imagem')
        .upload(nomeArquivo, blob, {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
      setImagem(null);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Selecionar Imagem" onPress={selecionarImagem} />
      {imagem && (
        <>
          <Image source={{ uri: imagem.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />
          <Button title="Fazer Upload" onPress={uploadImagem} />
        </>
      )}
      {carregando && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}
