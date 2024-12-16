import React from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/logo512.png')}
      />
      <Text style={styles.texto}>
        Bem-vindo ao aplicativo de agendamento de serviços com cat sitters!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 20,
  },
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    marginBottom: 40,
    borderBottomColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  texto: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
});
