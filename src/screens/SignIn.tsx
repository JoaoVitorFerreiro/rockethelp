import { useState } from 'react';
import auth from '@react-native-firebase/auth'
import { Envelope, Key} from 'phosphor-react-native'
import Logo from '../assets/logo_primary.svg'
import { 
  VStack, 
  Heading, 
  Icon, 
  useTheme,
  } from 'native-base'

import { 
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ButtonSignOut } from '../components/ButtonSignOut';
import { useNavigation } from '@react-navigation/native';


export function SignIn() {
    const { colors } = useTheme();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ isLoading, setIsLoading] = useState(false);

    const { navigate }  = useNavigation();

    function handleSignIn() {
      if(!email || !password) {
        return Alert.alert("Entrar","Informe e-mail e senha.")
      }
      setIsLoading(true);
      

      auth()
      .signInWithEmailAndPassword(email,password)
      .catch((error) => {
        setIsLoading(false);
        console.log(error);

        if(error.code === 'auth/invalid-email'){
          return Alert.alert("Entrar","E-mail inválido.")
        }

        if(error.code === 'auth/user-not-found'){
          return Alert.alert("Entrar","E-mail ou senha inválida.")
        }

        if(error.code === 'auth/wrong-password'){
          return Alert.alert("Entrar","E-mail ou senha inválida.")
        }
        console.warn(error);
        return Alert.alert("Entrar", 'Não foi possivel acessar')
        
      })
    }

    function handleSignUp(){
      navigate('signUp');
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
              <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
                <Logo/>

                <Heading color="gray.100" font-size="xl" mt={20} mb={6}>
                  Acesse a sua Conta
                </Heading>
                
                <Input 
                  placeholder="E-mail" 
                  mb={4}
                  InputLeftElement={ <Icon as= {<Envelope color={colors.gray[300]} />} ml={4}/>}
                  onChangeText={setEmail}
                />

                <Input 
                  placeholder="Senha"
                  mb={8}
                  InputLeftElement={ <Icon as= {<Key color={colors.gray[300]}/>} ml={4} />}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Button 
                  title='Entrar'
                  w='full'
                  onPress={handleSignIn}
                  isLoading={isLoading}
                  mb={3}
                />

                <ButtonSignOut 
                  title='Cadastrar'
                  w='full'
                  onPress={handleSignUp}
                />

              </VStack>
        </TouchableWithoutFeedback>
    );
  }