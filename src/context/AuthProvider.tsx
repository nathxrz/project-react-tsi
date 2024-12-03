import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext} from 'react';
// import EncryptedStorage from 'react-native-encrypted-storage';
import {Credencial} from '../model/types';
import {User} from '../model/User';

export const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
  async function signIn(credencial: Credencial) {
    console.log('Entrar', credencial);
    try {
      await auth().signInWithEmailAndPassword(
        credencial.email,
        credencial.senha,
      );
      return 'ok';
    } catch (error) {
      console.error(error);
      return launchServerMessageErro(error);
    }
  }

  async function signUp(user: User): Promise<string> {
    try {
      await auth().createUserWithEmailAndPassword(user.email, user.password);
      await auth().currentUser?.sendEmailVerification();
      const usuarioFirestore = {
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        // urlFoto: user.urlFoto,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .set(usuarioFirestore);
      return 'ok';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  function launchServerMessageErro(e: any): string {
    switch (e.code) {
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorreto.';
      case 'auth/user-not-found':
        return 'Usuário não cadastrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/invalid-email':
        return 'E-mail incorreto.';
      case 'auth/user-disabled':
        return 'Usuário desabilitado.';
      case 'auth/email-already-in-use':
        return 'Esse e-mail já está cadastrado.';
      default:
        return 'Erro desconhecido. Contate o administrador';
    }
  }

  return (
    <AuthContext.Provider value={{signIn, signUp}}>{children}</AuthContext.Provider>
  );
};
