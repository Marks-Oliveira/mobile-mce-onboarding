import React from 'react';
import AppLoading from 'expo-app-loading';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import Routes from './src/routes';
import AuthProvider from './src/contexts/AuthContext';

import {
   OpenSans_700Bold,
   OpenSans_600SemiBold,
   OpenSans_400Regular
} from "@expo-google-fonts/open-sans";

import {
   useFonts,
   Poppins_400Regular,
   Poppins_500Medium,
   Poppins_600SemiBold
} from "@expo-google-fonts/poppins";

export default function App() {
   const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_600SemiBold,
      OpenSans_700Bold,
      OpenSans_600SemiBold,
      OpenSans_400Regular
   });

   if (!fontsLoaded) return <AppLoading />;

   return (
      <AuthProvider>
         <NavigationContainer>
            <StatusBar style="auto" />
            <Routes />
            <Toast ref={(ref) => Toast.setRef(ref)} />
         </NavigationContainer>
      </AuthProvider>
   );
};
