import React, {useContext, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, TextInput, useTheme, Dialog, Text} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../context/AuthProvider';
import {User} from '../model/User';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    name: yup.string().required(requiredMessage),
    phone: yup
      .string()
      .required(requiredMessage)
      .length(11, 'Telefone inválido'),
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, 'E-mail inválido'),
    password: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
  })
  .required();

export default function SignUp({navigation}: any) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [showPassword, setDisplayPassword] = useState(true);
  const {signUp} = useContext<any>(AuthContext);
  const [requesting, setRequest] = useState(false);
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');
  const [message, setMessage] = useState({type: '', message: ''});
  const [dialogVisible, setDialogVisible] = useState(false);

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

  async function onSubmit(data: User) {
    if (!urlDevice) {
      Alert.alert('Atenção', 'Selecione uma foto para o perfil');
      return;
    }
    data.urlPhoto =
      'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
    setRequest(true);
    const responseMessage = await signUp(data, urlDevice);
    if (responseMessage === 'success') {
      setRequest(false);
      navigation.navigate('SignIn');
    } else {
      setRequest(false);
      Alert.alert('Erro', responseMessage);
    }
  }

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice
                ? {uri: urlDevice}
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

          {/* name  */}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                mode="outlined"
                label="Nome"
                placeholder="Digite seu primeio nome"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.name?.message?.toString()}
            </Text>
          )}

          {/* phone  */}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                mode="outlined"
                label="Telefone"
                placeholder="(xx) xxxxx-xxxx"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="phone" />}
              />
            )}
            name="phone"
          />
          {errors.phone && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.phone?.message?.toString()}
            </Text>
          )}

          {/* e-mail  */}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                mode="outlined"
                keyboardType="email-address"
                label="E-mail"
                placeholder="Digite seu email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="email" />}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.email?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                mode="outlined"
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry={showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setDisplayPassword(previus => !previus)}
                  />
                }
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.password?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            loading={requesting}
            disabled={requesting}
            onPress={handleSubmit(onSubmit)}>
            {!requesting ? 'Cadastrar-se' : 'Cadastrando'}
          </Button>
        </>
      </ScrollView>

      <Dialog
        visible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textEsqueceuSenha: {
    alignSelf: 'flex-end',
  },
  textCadastro: {},
  textError: {
    width: 350,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
  },
  divCadastro: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
  textDialog: {
    textAlign: 'center',
  },
});
