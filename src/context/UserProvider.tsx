import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext} from 'react';
import {User} from '../model/User';
import {AuthContext} from './AuthProvider';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import storage from '@react-native-firebase/storage';

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

  async function updateUser(data: User, urlDevice: string): Promise<string> {
    console.log('updateUser', data);
    console.log('urlDevice:', urlDevice);
    try {
      if (urlDevice !== '') {
        data.urlPhoto = await sendImageToStorage(data, urlDevice);
        if (!data.urlPhoto) {
          return 'Erro ao atualizar o usuário. Contate o suporte.';
        }
      }
      const userFirestore = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        urlPhoto: data.urlPhoto,
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

  async function sendImageToStorage(
    data: User,
    urlDevice: string,
  ): Promise<string> {
    let resizedImage = await ImageResizer.createResizedImage(
      urlDevice,
      150,
      200,
      'PNG',
      80,
    );

    const pathToStorage = `images/users/${auth().currentUser?.uid}/foto.png`;

    let url: string | null = '';
    const task = storage().ref(pathToStorage).putFile(resizedImage?.uri);

    await task.then(async () => {
      url = await storage().ref(pathToStorage).getDownloadURL();
    });
    task.catch(e => {
      console.error('UserProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  async function removeUser(uid: string): Promise<string> {
    try {
      await firestore().collection('usuarios').doc(uid).delete();
      const pathStorage = `images/users/${uid}/foto.png`;
      await storage().ref(pathStorage).delete();
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
