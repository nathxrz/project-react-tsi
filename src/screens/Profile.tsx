import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
import {User} from '../model/User';
import {UserContext} from '../context/UserProvider';
import {CommonActions} from '@react-navigation/native';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required(requiredMessage)
      .min(2, 'O nome deve ter ao menos 2 caracteres'),
    phone: yup
      .string()
      .required(requiredMessage)
      .length(11, 'Telefone inválido'),
  })
  .required();

export default function Profile({navigation}: any) {
  const theme = useTheme();
  const {userAuth} = useContext<any>(AuthContext);
  const {updateUser, removeUser} = useContext<any>(UserContext);
  const [message, setMessage] = useState({type: '', message: ''});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisibleRemove, setDialogVisibleRemove] = useState(false);
  const [requesting, setRequest] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      name: userAuth.name,
      email: userAuth.email,
      phone: userAuth.phone,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    register('name');
    register('email');
    register('phone');
  }, [register]);

  async function update(data: User) {
    setRequest(true);
    const updated = await updateUser(data);
    if (updated === 'success') {
      setMessage({type: 'success', message: 'Usuário atualizado com sucesso'});
      setDialogVisible(true);
      setRequest(false);
    } else {
      setMessage({type: 'erro', message: updated});
      setDialogVisible(true);
      setRequest(false);
    }
  }

  async function alertRemove() {
    setDialogVisibleRemove(true);
  }

  async function remove() {
    setDialogVisibleRemove(false);
    const removed = await removeUser(userAuth.uid);
    if (removed === 'success') {
      setMessage({type: 'success', message: 'Usuário removido com sucesso'});
      setDialogVisible(true);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        }),
      );
    } else {
      setMessage({type: 'erro', message: removed});
      setDialogVisibleRemove(true);
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
                label="Nome"
                placeholder="Digite seu nome completo"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="smart-card" />}
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
                label="Telefone"
                placeholder="Digite seu telefone"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
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

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="E-mail"
                placeholder="Digite seu e-mail"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                disabled={true}
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
            loading={requesting}
            disabled={requesting}
            onPress={handleSubmit(update)}>
            {!requesting ? 'Salvar informações' : 'Salvando'}
          </Button>

          <Text
            style={styles.textRemoveAccount}
            onPress={handleSubmit(alertRemove)}>
            Excluir conta
          </Text>
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

      <Dialog
        visible={dialogVisibleRemove}
        onDismiss={() => {
          setDialogVisibleRemove(false);
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
