import auth from '@react-native-firebase/auth';
import React, {createContext} from 'react';
import {Credencial} from '../model/types';

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
    <AuthContext.Provider value={{signIn}}>{children}</AuthContext.Provider>
  );
};
