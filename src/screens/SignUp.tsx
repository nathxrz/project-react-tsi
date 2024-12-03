import React, {useContext, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, TextInput, useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../context/AuthProvider';
import { User } from '../model/User';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    name: yup
    .string()
    .required(requiredMessage),
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

  async function cadastrar(data: User) {
    const message = await signUp(data);
    if (message === 'ok') {
      navigation.navigate('SignIn');
    } else {
      Alert.alert('Erro', message);
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
            source={require('../assets/images/logo512.png')}
          />

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
                right={<TextInput.Icon icon="eye" onPress={() => setDisplayPassword(previus => !previus)} />}
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
            onPress={handleSubmit(cadastrar)}>
            Cadastrar-se
          </Button>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    // borderRadius: 200 / 2,
    marginTop: 10,
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
});
