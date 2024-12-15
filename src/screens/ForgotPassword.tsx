import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';
import * as yup from 'yup';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';

const requiredMessage = 'Campo obrigatório';

const schema = yup.object().shape({
  email: yup
    .string()
    .required(requiredMessage)
    .matches(/\S+@\S+\.\S+/, 'E-mail inválido'),
});

export default function ForgotPassword({navigation}: any) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [requesting, setRequest] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [message, setMessage] = useState({tipo: '', message: ''});
  const {recoverPassword} = useContext<any>(AuthContext);

  async function onSubmit(data: any) {
    const msg = await recoverPassword(data.email);
    if (msg === 'success') {
      setRequest(true);
      setMessage({
        tipo: 'success',
        message:
          'Se o e-mail estiver registrado, enviaremos um link para redefinir sua senha.',
      });
      setDialogVisible(true);
    } else {
      setRequest(false);
      setDialogVisible(true);
      setMessage({tipo: 'Erro:', message: msg});
    }
  }

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}>
      <Text variant="headlineMedium">Recuperar Senha</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            autoCapitalize="none"
            mode="outlined"
            label="E-mail"
            placeholder="Digite seu e-mail"
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
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={requesting}
        disabled={requesting}>
        {!requesting ? 'Enviar' : 'Enviando'}
      </Button>

      <Dialog
        visible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
          if (message.tipo === 'success') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon icon="alert-circle-outline" size={60} />
        <Dialog.Title style={styles.textDialog}>
          {message.tipo === 'success' ? 'Informação' : 'Atenção'}
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
    paddingTop: 20,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textError: {
    width: 350,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
    width: 350,
  },
  textDialog: {
    textAlign: 'center',
  },
});
