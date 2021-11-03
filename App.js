import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from './components/screens/login';
import { RegisterScreen } from './components/screens/register';


export default function App() {
  return (
    <View style={styles.container}>
      < LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
