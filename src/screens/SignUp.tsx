import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth'

import Logo from '../assets/logo_primary.svg'
import { 
  VStack, 
  Heading, 
  Icon, 
  useTheme,
  HStack, 
  IconButton,
  } from 'native-base'

import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'


import { Envelope, Key, CaretLeft} from 'phosphor-react-native'
import { Input } from '../components/Input'
import { Button } from '../components/Button';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack(){
    navigation.goBack()
  }

  async function handleRegister(){
    if(password != confirmPassword) {
      Alert.alert("Cadastrar", "As senhas precisam ser iguais")
    }
    if(password.length<6) {
      Alert.alert("Cadastrar", "A senha precisa ter pelo menos 6 digitos")
    }
    if(!password || !confirmPassword ||!email) {
      Alert.alert("Cadastrar", "Precisa digitar todas as informações")
    }

   await auth()
    .createUserWithEmailAndPassword(email,password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Cadastrar", "Esse email já está cadastrado")
      }
  
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Cadastrar', "Informe um email válido");
      }
    });
  }

  return ( 
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo/>

            <HStack         
              w='full'
              justifyContent="space-between"
              alignItems="center"
              pb={6}
              pt={12}
              mt={7} 
              mb={6}
            >
        
              <IconButton
                  icon={<CaretLeft color={colors.gray[200]} size={24}/>}
                  onPress={handleGoBack}
              />
              
              <Heading color="gray.100" textAlign="center" font-size="xl" ml={-6} flex={1}>
                Cria a sua conta
              </Heading>
            </HStack>

              <Input 
                placeholder="E-mail" 
                mb={4}
                InputLeftElement={ <Icon as= {<Envelope color={colors.gray[300]} />} ml={4}/>}
                onChangeText={setEmail}
              />

              <Input 
                placeholder="Senha" 
                mb={4}
                InputLeftElement={ <Icon as= {<Key color={colors.gray[300]} />} ml={4}/>}
                secureTextEntry
                onChangeText={setConfirmPassword}
              />

              <Input 
                placeholder="Confirme a sua senha" 
                mb={4}
                InputLeftElement={ <Icon as= {<Key color={colors.gray[300]} />} ml={4}/>}
                secureTextEntry
                onChangeText={setPassword}
              />
              
              <Button
                title='Cadastrar'
                w="full"
                onPress={handleRegister}
              />

          </VStack>
    </TouchableWithoutFeedback>
  );
}