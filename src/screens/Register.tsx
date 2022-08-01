import React, { useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { useNavigation } from '@react-navigation/native'

import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';

export function Register() {
  const [ user, setUser] = useState<FirebaseAuthTypes.User>();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ patrimony, setPatrimony ] = useState('');
  const [ description, setDesciption] = useState('');

  const navigation = useNavigation();
 
  auth().onAuthStateChanged((user) => {
    setUser(user);
  })

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Registrar', 'Preencha todos os campos.');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp(),
        user_id: user.uid
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert('Solicitação', 'Não foi possível registrar o pedido');
      });
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
      <VStack flex={1} p={6} bg='gray.600'>
          <Header title='Nova solicitação'/>

          <Input
              placeholder='Número do patrimônio'
              mt={5}
              onChangeText={setPatrimony}
          />
          
          <Input
              placeholder='Descrição do Problema'
              flex={1}
              mt={5}
              multiline
              textAlignVertical='top'
              onChangeText={setDesciption}
          />

          <Button
              title="Cadastrar"
              mt={5}
              isLoading={isLoading}
              onPress={handleNewOrderRegister}
          />
      </VStack>
    </TouchableWithoutFeedback>
  );
}