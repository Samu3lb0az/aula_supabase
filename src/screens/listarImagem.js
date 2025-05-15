import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import supabase from '../../supabaseConfig';

export default function ListarImagem({ userId, nome }) {
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarImagens();
  }, []);

  const carregarImagens = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('bucket-storage-senai-29')
        .list('perfil_imagem', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (error) throw error;

      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from('bucket-storage-senai-29')
            .getPublicUrl(`perfil_imagem/${file.name}`);
          return {
            nomeArquivo: file.name,
            url: urlData.publicUrl,
          };
        })
      );

      setImagens(urls);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={{ uri: item.url }} style={styles.imagem} />
      <Text style={styles.nomeArquivo}>{item.nomeArquivo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={imagens}
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
  imagem: {
    width: 320,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  nomeArquivo: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});
