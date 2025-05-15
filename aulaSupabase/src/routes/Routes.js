// src/routes/Routes.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Cadastro from '../screens/cadastro';
import Inicio from '../screens/inicio';
import UploadImagem from '../screens/uploadImage';
import UploadVideo from '../screens/uploadVideo';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inicio"
        component={Inicio}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UploadImagem"
        component={UploadImagem}
        options={{
          title: 'Enviar Imagem',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="UploadVideo"
        component={UploadVideo}
        options={{
          title: 'Enviar Vídeo',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack.Navigator>
  );
}
