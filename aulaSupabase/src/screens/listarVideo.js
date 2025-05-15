import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Video, // React Native não tem componente Video nativo, veja observação abaixo
} from 'react-native';
import { Video as ExpoVideo } from 'expo-av'; // Recomendado usar expo-av para vídeo
import supabase from '../../supabaseConfig';

export default function ListarVideo({ userId, nome }) {
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarVideos();
  }, []);

  const carregarVideos = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('bucket-storage-senai-29')
        .list('perfil_video', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (error) throw error;

      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from('bucket-storage-senai-29')
            .getPublicUrl(`perfil_video/${file.name}`);
          return {
            nomeArquivo: file.name,
            url: urlData.publicUrl,
          };
        })
      );

      setVideos(urls);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <ExpoVideo
        source={{ uri: item.url }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        isLooping
      />
      <Text style={styles.nomeArquivo}>{item.nomeArquivo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.nomeArquivo}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  item: {
    marginBottom: 20,
    alignItems: 'center',
  },
  video: {
    width: 320,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  nomeArquivo: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});
