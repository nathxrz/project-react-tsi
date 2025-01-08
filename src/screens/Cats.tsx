import React, {useContext} from 'react';
import {CatContext} from '../context/CatProvider';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, FAB, List, useTheme} from 'react-native-paper';
import {Cat} from '../model/Cat';

export default function Cats({navigation}: any) {
  const {cats} = useContext<any>(CatContext);
  const theme = useTheme();

  const goCatProfile = (cat: Cat | null) => {
    navigation.navigate('CatProfile', {
      cat,
    });
  };

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section
        style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>Seus gatos</List.Subheader>
        <ScrollView>
          {cats.map((cat: Cat, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => goCatProfile(cat)}>
              <Card.Title
                title={cat.name}
                left={() => (
                  <Avatar.Image size={40} source={{uri: cat.urlPhoto}} />
                )}
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
      <FAB icon="plus" style={styles.fab} onPress={() => goCatProfile(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

//   TODO: ajustar o style
