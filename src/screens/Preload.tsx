import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';

export default function Preload({navigation}: any) {
  const theme = useTheme();

  const {setUserAuth, getCredentials, signIn} = useContext<any>(AuthContext);
  const {getUser} = useContext<any>(UserContext);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        await searchUser();
      } else {
        goSignIn();
      }
    });
    return () => {
      unsubscribe();
    };
  });

  async function searchUser() {
    const user = await getUser();
    if (user) {
      setUserAuth(user);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AppStack'}],
        }),
      );
    }
  }

  async function goSignIn() {
    const credencial = await getCredentials();
    if (credencial !== null) {
      const logged = await signIn(credencial);
      if (logged === 'success') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'AppStack'}],
          }),
        );
      }
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        }),
      );
    }
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Image
        style={styles.imagem}
        source={require('../assets/images/logo512.png')}
        accessibilityLabel="logo do app"
      />
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
