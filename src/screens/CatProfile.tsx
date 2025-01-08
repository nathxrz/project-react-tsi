import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {CatContext} from '../context/CatProvider';
import {Cat} from '../model/Cat';

const requiredMessage = 'Campo obrigatório';
const schema = yup.object().shape({
  name: yup
    .string()
    .required(requiredMessage)
    .min(2, 'O nome deve ter ao menos 2 caracteres'),
  gender: yup.string().required(requiredMessage).min(1, 'Gênero obrigatório'),
  breed: yup.string().required(requiredMessage).min(2, 'Raça obrigatória'),
  routine: yup.string().required(requiredMessage).min(2, 'Rotina obrigatória'),
  behavior: yup
    .string()
    .required(requiredMessage)
    .min(2, 'Comportamento obrigatório'),
});

export default function CatProfile({route, navigation}: any) {
  const theme = useTheme();
  const [cat, setCat] = useState<Cat | null>(route.params.cat);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      name: cat?.name,
      gender: cat?.gender,
      breed: cat?.breed,
      routine: cat?.routine,
      behavior: cat?.behavior,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [requestUpdate, setRequestUpdate] = useState(false);
  const [requestDelete, setRequestDelete] = useState(false);
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({type: '', message: ''});
  const [dialogErroVisible, setDialogErroVisible] = useState(false);
  const {saveCat, deleteCat} = useContext<any>(CatContext);
  const [dialogVisibleRemove, setDialogVisibleRemove] = useState(false);

  const searchInGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        setMessage({type: 'erro', message: 'Erro ao buscar a imagem!'});
      } else if (response.didCancel) {
        setMessage({type: 'success', message: 'Você cancelou esta ação!'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path);
      }
    });
  };

  const takeAPicture = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.errorCode) {
        setMessage({type: 'erro', message: 'Erro ao buscar a imagem!'});
      } else if (response.didCancel) {
        setMessage({type: 'success', message: 'Você cancelou esta ação!'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path);
      }
    });
  };

  async function update(data: Cat) {
    data.uid = cat?.uid || '';
    data.urlPhoto =
      cat?.urlPhoto ||
      'https://firebasestorage.googleapis.com/v0/b/project-react-14a12.firebasestorage.app/o/images%2Fusers%2Favatar%2Fperson.png?alt=media&token=58064a49-e769-4f32-8a15-b2533cc9df65';
    setRequestUpdate(true);
    setUpdating(true);
    const updated = await saveCat(data, urlDevice);
    if (updated === 'success') {
      setMessage({
        type: 'success',
        message: 'Gato adicionado ou atualizado com sucesso!',
      });
      setDialogErroVisible(true);
      setRequestUpdate(false);
      setUpdating(false);
    } else {
      setMessage({type: 'erro', message: updated});
      setDialogErroVisible(true);
      setRequestUpdate(false);
      setUpdating(false);
    }
  }

  async function alertRemove() {
    setDialogVisibleRemove(true);
  }

  async function remove() {
    setDialogVisibleRemove(false);
    setRequestDelete(true);
    setDeleting(true);
    const deleted = await deleteCat(cat);
    if (deleted === 'success') {
      setDialogErroVisible(true);
      setRequestDelete(false);
      setDeleting(false);
      setMessage({type: 'success', message: 'Gato excluído com sucesso!'});
    } else {
      setMessage({type: 'erro', message: deleted});
      setDialogErroVisible(true);
      setRequestDelete(false);
      setDeleting(false);
    }
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ''
                ? {uri: urlDevice}
                : cat && cat?.urlPhoto !== ''
                ? {uri: cat?.urlPhoto}
                : require('../assets/images/person.png')
            }
            loadingIndicatorSource={require('../assets/images/person.png')}
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={[styles.buttonImage, styles.borderRadiusBtnRight]}
              mode="outlined"
              icon="image"
              onPress={() => searchInGallery()}>
              Galeria
            </Button>
            <Button
              style={[styles.buttonImage, styles.borderRadiusBtnLeft]}
              mode="outlined"
              icon="camera"
              onPress={() => takeAPicture()}>
              Foto
            </Button>
          </View>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Nome"
                placeholder="Digite o nome do seu gato"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="cat" />}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.name?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Gênero"
                placeholder="Digite o gênero do seu gato"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="gender-male-female" />}
              />
            )}
            name="gender"
          />
          {errors.gender && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.gender?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Raça"
                placeholder="Digite a raça do seu gato"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="paw" />}
              />
            )}
            name="breed"
          />
          {errors.breed && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.breed?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Rotina"
                placeholder="Digite a rotina do seu gato"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="clock" />}
              />
            )}
            name="routine"
          />
          {errors.routine && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.routine?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Informações comportamentais"
                placeholder="Digite o comportamento do seu gato"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="emoticon-happy-outline" />}
              />
            )}
            name="behavior"
          />
          {errors.behavior && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.behavior?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(update)}
            loading={requestUpdate}
            disabled={requestUpdate}>
            {!updating ? 'Salvar' : 'Salvando'}
          </Button>

          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={handleSubmit(alertRemove)}
            loading={requestDelete}
            disabled={!cat || requestDelete}>
            {!deleting ? 'Excluir' : 'Excluindo'}
          </Button>
        </>
      </ScrollView>
      <Dialog
        visible={dialogVisibleRemove}
        onDismiss={() => {
          setDialogVisibleRemove(false);
          if (message.type === 'success') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>{'Atenção'}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {'Você tem certeza que deseja excluir sua conta?'}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisibleRemove(false)}>
            Cancelar
          </Button>
          <Button onPress={remove}>Excluir</Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        visible={dialogErroVisible}
        onDismiss={() => {
          setDialogVisibleRemove(false);
          if (message.type === 'success') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon
          icon={
            message.type === 'success'
              ? 'checkbox-marked-circle-outline'
              : 'alert-circle-outline'
          }
          size={60}
        />
        <Dialog.Title style={styles.textDialog}>
          {message.type === 'success' ? 'Parabéns' : 'Atenção'}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {message.message}
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 200 / 2,
    borderWidth: 1,
    borderColor: '#9b9b9b',
    marginTop: 50,
    marginBottom: 40,
  },
  button: {
    marginTop: 50,
    marginBottom: 10,
  },
  texto: {
    color: 'black',
    fontSize: 30,
  },
  textError: {
    width: 350,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textDialog: {
    textAlign: 'center',
  },
  textRemoveAccount: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  divButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonImage: {
    width: 170,
  },
  borderRadiusBtnRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  borderRadiusBtnLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonOthers: {
    marginTop: 20,
    marginBottom: 30,
    width: 350,
  },
});
