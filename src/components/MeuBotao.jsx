import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

export default function MeuBotao(props) {
  return (
    <TouchableHighlight
      onPress={props.aoClicar}
      style={{...styles.botao, backgroundColor: props.cor}}>
      <Text>Incrementar</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 200,
    height: 50,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
});