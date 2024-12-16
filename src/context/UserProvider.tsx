import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext} from 'react';
import {User} from '../model/User';
import {AuthContext} from './AuthProvider';

export const UserContext = createContext({});

export const UserProvider = ({children}: any) => {
  const {setUserAuth, removeCredentials} = useContext<any>(AuthContext);

  async function getUser() {
    try {
      let doc = await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .get();
      if (doc.exists) {
        const user = doc.data();
        if (user) {
          user.uid = auth().currentUser?.uid;
          return user;
        }
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function updateUser(data: User): Promise<string> {
    try {
      const userFirestore = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .update(userFirestore);

      const updatedUser = await getUser();
      setUserAuth(updatedUser);
      return 'success';
    } catch (e) {
      console.error(e);
      return 'Erro ao atualizar. Tente novamente.';
    }
  }

  async function removeUser(uid: string): Promise<string> {
    try {
      await firestore().collection('usuarios').doc(uid).delete();
      await auth().currentUser?.delete();
      await removeCredentials();
      return 'success';
    } catch (e) {
      console.error(e);
      return 'Erro ao excluir a conta. Contate o suporte.';
    }
  }

  return (
    <UserContext.Provider value={{getUser, updateUser, removeUser}}>
      {children}
    </UserContext.Provider>
  );
};
