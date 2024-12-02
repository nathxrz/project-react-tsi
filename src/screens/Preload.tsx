import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Dialog, Text, useTheme} from 'react-native-paper';

export default function Preload({navigation}: any) {
  const theme = useTheme();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(String);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'AppStack'}],
          }),
        );
      } else {
        setErrorMessage('Você precisa verificar seu e-mail antes de continuar');
        setVisibleDialog(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  function goSignIn() {
    setVisibleDialog(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      }),
    );
  }
  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Image
        style={styles.imagem}
        source={require('../assets/images/logo512.png')}
        accessibilityLabel="logo do app"
      />
      <Dialog visible={visibleDialog} onDismiss={goSignIn}>
        <Dialog.Icon icon="alert-circle-outline" size={60} />
        <Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {errorMessage}
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 250,
    height: 250,
  },
  textDialog: {
    textAlign: 'center',
  },
});
