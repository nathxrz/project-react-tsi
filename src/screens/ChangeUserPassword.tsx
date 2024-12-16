import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    senha: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
    senha_nova: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
    confirmar_senha: yup
      .string()
      .required(requiredMessage)
      .equals([yup.ref('senha_nova')], 'As senhas não conferem'),
  })
  .required();

export default function ChangeUserPassword() {
  const theme = useTheme();
  const {userAuth, signIn, changePassword} = useContext<any>(AuthContext);
  const [requesting, setRequest] = useState(false);
  const [message, setMessage] = useState({type: '', message: ''});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showCurrentPassword, setDisplayCurrentPassword] = useState(true);
  const [showNewPassword, setDisplayNewPassword] = useState(true);
  const [showPasswordConfirmation, setDisplayPasswordConfirmation] = useState(true);

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      senha: '',
      senha_nova: '',
      confirmar_senha: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: {
    senha: string;
    senha_nova: string;
    confirmar_senha: string;
  }) {
    setRequest(true);
    const logged = await signIn({email: userAuth.email, senha: data.senha});
    if (logged !== 'success') {
      setRequest(false);
      setMessage({type: 'erro', message: 'Senha atual incorreta'});
      setDialogVisible(true);
      return;
    }
    if (data.senha_nova === data.confirmar_senha) {
      const changedPassword = await changePassword(data.senha_nova);
      if (changedPassword === 'success') {
        setDialogVisible(true);
        setMessage({type: 'success', message: 'Senha alterada com sucesso'});
        setRequest(false);
      } else {
        setRequest(false);
        setMessage({type: 'erro', message: changedPassword});
        setDialogVisible(true);
      }
    } else {
      setRequest(false);
      setMessage({type: 'erro', message: 'As senhas não conferem'});
      setDialogVisible(true);
    }
  }

  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={require('../assets/images/logo512.png')}
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Senha Atual"
                placeholder="Digite sua senha atual"
                mode="outlined"
                autoCapitalize="none"
                secureTextEntry={showCurrentPassword}
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setDisplayCurrentPassword(previus => !previus)}
                  />
                }
              />
            )}
            name="senha"
          />
          {errors.senha && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.senha?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Senha nova"
                placeholder="Digite sua nova senha"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                secureTextEntry={showNewPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setDisplayNewPassword(previus => !previus)}
                  />
                }
              />
            )}
            name="senha_nova"
          />
          {errors.senha_nova && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.senha_nova?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Confirmar senha"
                placeholder="Confirme sua senha"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="go"
                secureTextEntry={showPasswordConfirmation}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setDisplayPasswordConfirmation(previus => !previus)}
                  />
                }
              />
            )}
            name="confirmar_senha"
          />
          {errors.confirmar_senha && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.confirmar_senha?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            loading={requesting}
            disabled={requesting}
            onPress={handleSubmit(onSubmit)}>
            {!requesting ? 'Redefinir senha' : 'Redefinindo'}
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
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
  },
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    // borderRadius: 200 / 2,
    marginTop: 100,
    marginBottom: 40,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
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
  },
});
