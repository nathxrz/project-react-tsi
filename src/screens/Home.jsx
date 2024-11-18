import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


export default function Home() {
  return (
    <View style={styles.container}>
        <Text style={styles.texto}>Bem-vinda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
  },
  texto: {
    color: 'black',
    fontSize: 30,
  },
});
