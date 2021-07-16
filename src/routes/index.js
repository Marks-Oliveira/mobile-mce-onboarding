import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

import { useAuth } from '../hooks/useAuth';
import { colors } from '../styles/colors';

const Routes = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator 
          size={Platform.OS === "android" ? 60 : "large"}
          color={colors.purple}
        />
      </View>
    );
  };

  return token ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
