import ImageResizer from '@bam.tech/react-native-image-resizer';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {createContext, useEffect, useState} from 'react';
import {Cat} from '../model/Cat';

export const CatContext = createContext({});

export const CatProvider = ({children}: any) => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('cats')
      .orderBy('name')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Cat[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              name: doc.data().name,
              gender: doc.data().gender,
              breed: doc.data().breed,
              routine: doc.data().routine,
              behavior: doc.data().behavior,
              urlPhoto: doc.data().urlPhoto,
            });
          });
          setCats(data);
        }
      });
    return () => listener();
  }, []);

  async function sendImageToStorage(
    cat: Cat,
    urlDevice: string,
  ): Promise<string> {
    let imageRedimencionada = await ImageResizer.createResizedImage(
      urlDevice,
      150,
      200,
      'PNG',
      80,
    );

    const pathToStorage = `images/cats/${cat?.uid}/foto.png`;

    let url: string | null = '';
    const task = storage().ref(pathToStorage).putFile(imageRedimencionada?.uri);

    await task.then(async () => {
      url = await storage().ref(pathToStorage).getDownloadURL();
    });
    task.catch(e => {
      console.error('CatProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  async function saveCat(cat: Cat, urlDevice: string): Promise<string> {
    try {
      if (cat.uid === '') {
        cat.uid = firestore().collection('cats').doc().id;
      }
      if (urlDevice !== '') {
        cat.urlPhoto = await sendImageToStorage(cat, urlDevice);
        if (!cat.urlPhoto) {
          return 'Erro ao salvar a imagem. Contate o suporte.';
        }
      }

      await firestore().collection('cats').doc(cat.uid).set(
        {
          name: cat.name,
          gender: cat.gender,
          breed: cat.breed,
          routine: cat.routine,
          behavior: cat.behavior,
          urlPhoto: cat.urlPhoto,
        },
        {merge: true},
      );
      return 'success';
    } catch (e) {
      return 'Não foi possível inserir ou atualizar o felino. Contate o suporte';
    }
  }

  async function deleteCat(cat: Cat): Promise<string> {
    try {
      await firestore().collection('cats').doc(cat.uid).delete();
      const pathStorage = `images/cats/${cat.uid}/foto.png`;
      await storage().ref(pathStorage).delete();
      return 'success';
    } catch (e) {
      return 'Não foi possível excluir o felino. Contate o suporte';
    }
  }

  return (
    <CatContext.Provider value={{cats, saveCat, deleteCat}}>
      {children}
    </CatContext.Provider>
  );
};
