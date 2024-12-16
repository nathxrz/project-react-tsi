import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useState} from 'react';
// import EncryptedStorage from 'react-native-encrypted-storage';
import {Credencial} from '../model/types';
import {User} from '../model/User';
import EncryptedStorage from 'react-native-encrypted-storage';

export const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
  const [userAuth, setUserAuth] = useState<FirebaseAuthTypes.User | null>(null);

  async function saveCredentials(credencial: Credencial): Promise<void> {
    if (credencial) {
      try {
        await EncryptedStorage.setItem(
          'credencial',
          JSON.stringify(credencial),
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function getCredentials(): Promise<Credencial | null> {
    try {
      const credencial = await EncryptedStorage.getItem('credencial');
      return credencial ? JSON.parse(credencial) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function removeCredentials(): Promise<void> {
    try {
      await EncryptedStorage.removeItem('credencial');
    } catch (e) {
      console.error(e);
    }
  }

  async function signIn(credencial: Credencial) {
    try {
      await auth().signInWithEmailAndPassword(
        credencial.email,
        credencial.senha,
      );
      const currentUser = auth().currentUser;

      if (currentUser?.emailVerified) {

        setUserAuth(currentUser);
        await saveCredentials(credencial);
        return 'success';
      } else {
        await auth().signOut();
        return 'E-mail não verificado. Verifique seu e-mail.';
      }
    } catch (error) {
      return launchServerMessageErro(error);
    }
  }

  async function signUp(user: User): Promise<string> {
    try {
      await auth().createUserWithEmailAndPassword(user.email, user.password);
      await auth().currentUser?.sendEmailVerification();
      const usuarioFirestore = {
        name: user.name,
        phone: user.phone,
        email: user.email,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .set(usuarioFirestore);
      return 'success';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  async function signOut(): Promise<string> {
    try {
      setUserAuth(null);
      if (auth().currentUser) {
        await auth().signOut();
        await removeCredentials();
      }
      return 'success';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  async function recoverPassword(email: string): Promise<string> {
    try {
      await auth().sendPasswordResetEmail(email);
      return 'success';
    } catch (e) {
      console.error(e);
      return launchServerMessageErro(e);
    }
  }

  function launchServerMessageErro(e: any): string {
    switch (e.code) {
      case 'auth/user-not-found':
        return 'Usuário não cadastrado.';
        case 'auth/invalid-credential':
          return 'E-mail ou senha incorreto.';
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
    <AuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
        signIn,
        signUp,
        signOut,
        recoverPassword,
        getCredentials,
        removeCredentials
      }}>
      {children}
    </AuthContext.Provider>
  );
};
