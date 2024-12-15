import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext} from 'react';

export const UserContext = createContext({});

export const UserProvider = ({children}: any) => {
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

  return (
    <UserContext.Provider value={{getUser}}>
        {children}
    </UserContext.Provider>);
};
