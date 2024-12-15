// import {CommonActions} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  //   Button,
  Dialog,
  //   Divider,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';
// import {Background} from '@react-navigation/elements';

export default function Menu({navigation}: any) {
  const theme = useTheme();
  const {signOut} = useContext<any>(AuthContext);
  const [dialogVisible, setDialogVisible] = useState(false);

  async function logOut() {
    const msg = await signOut();
    if (msg === 'success') {
      navigation.navigate('AuthStack');
    } else {
      setDialogVisible(true);
    }
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Item
        title="Perfil"
        left={() => <List.Icon color={theme.colors.primary} icon="account" />}
        onPress={() => navigation.navigate('Profile')}
      />
      <List.Item
        title="Sair"
        left={() => <List.Icon color={theme.colors.primary} icon="logout" />}
        onPress={logOut}
      />
      <Dialog
        visible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>'Ops!'</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {
              'Estamos com problemas em realizar está operação no momento. Tente mais tarde!'
            }
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  textDialog: {
    textAlign: 'center',
  },
});
