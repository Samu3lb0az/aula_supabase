import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../../supabaseConfig';
import 'react-native-url-polyfill/auto';

export default function UploadVideo() {
  const [video, setVideo] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const selecionarVideo = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!resultado.canceled) {
      setVideo(resultado.assets[0]);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;

    try {
      setCarregando(true);
      const response = await fetch(video.uri);
      const blob = await response.blob();
      const nomeArquivo = `${Date.now()}.mp4`;

      const { error } = await supabase.storage
        .from('bucket-storage-senai-29/videos')
        .upload(nomeArquivo, blob, {
          contentType: 'video/mp4',
        });

      if (error) throw error;

      Alert.alert('Sucesso', 'Vídeo enviado com sucesso!');
      setVideo(null);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Selecionar Vídeo" onPress={selecionarVideo} />
      {video && (
        <>
          <Text style={{ marginVertical: 10 }}>{video.uri}</Text>
          <Button title="Fazer Upload" onPress={uploadVideo} />
        </>
      )}
      {carregando && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}
