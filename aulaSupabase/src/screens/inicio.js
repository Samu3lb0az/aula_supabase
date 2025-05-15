import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity, // importado corretamente
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import supabase from '../../supabaseConfig';
import ListarImagem from '../screens/listarImagem';
import ListarVideo from '../screens/listarVideo';

const Tab = createBottomTabNavigator();

export default function Inicio({ route, navigation }) {
  const { nome, photoUrl, userId } = route.params;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const CustomHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: photoUrl || 'https://via.placeholder.com/40' }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{nome}</Text>
      </View>
      <Button title="Sair" onPress={handleLogout} color="#FF3B30" />
    </View>
  );

  return (
    <>
      <CustomHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName =
              route.name === 'Imagens' ? 'photo-camera' : 'videocam';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
        })}
      >
        <Tab.Screen
          name="Imagens"
          children={() => <ListarImagem userId={userId} nome={nome} />}
        />
        <Tab.Screen
          name="Vídeos"
          children={() => <ListarVideo userId={userId} nome={nome} />}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
