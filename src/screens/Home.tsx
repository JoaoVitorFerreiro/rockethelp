import { useState, useEffect } from 'react'
import { 
    HStack, 
    IconButton, 
    VStack, 
    useTheme, 
    Text, 
    Heading, 
    FlatList,
    Center,
} from 'native-base';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { dateFormat } from '../utils/firestoreDateFormat';
import { useAuthContext } from '../context/AuthContext';

import { useNavigation } from '@react-navigation/native';

import { Alert } from 'react-native';

import { SignOut,ChatTeardropText, User } from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg'

import { Filter } from '../components/Filter';
import { FilterUser } from '../components/FilterUser';
import { Button } from '../components/Button';
import { Order, OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { OrderDTO } from '../DTOs/OrderDTO';

interface OrderState {
    id: string;
    patrimony: string;
    description: string;
    when: string;
    status: 'open' | 'closed',
  }

export function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuthContext()
  
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [ userFiter, setUserFilter ] = useState<'all' | 'user'>('all')
  const [orders, setOrders] = useState<OrderProps[]>([])

  function handleNewOrder() {
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId })
  }

  function handleLogout(){
    auth()
    .signOut()
    .catch(
        error =>{ 
        console.log(error);
        return Alert.alert('Sair', "Não foi possivel sair")
    })
  }

  function handleOpenSettings() {
    navigation.navigate('settings')
  }

  useEffect(() => {
    setIsLoading(true);

    let query = firestore()
    .collection<OrderDTO>('orders')
    .orderBy("created_at", "asc")
    .where('status', '==', statusSelected)

    if (userFiter === 'user') {
        query = query.where("user_id", "==", user.uid)
    }

    const subscriber = query.onSnapshot(snapshot => {
        const data = snapshot.docs.map((doc): OrderState => {
            const { patrimony, description, status, created_at } = doc.data();
            return {
                id: doc.id,
                patrimony,
                description,
                status, 
                when: dateFormat(created_at)
            };
        });
            setOrders(data);
            setIsLoading(false);
    }, console.warn);

    return subscriber;
  },[statusSelected, userFiter])


  return (
    <VStack flex={1} pb={6} bg="gray.700">
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={6}
            px={6}
        >
            <Logo/>
            <IconButton
                icon={<SignOut size={26} color={colors.gray[300]}/>}
                onPress={handleLogout}
            />

        </HStack>

        <VStack flex={1} px={6}>
            <HStack w='full' mt={8} mb={4} justifyContent="space-between" alignItems="center">
                <Heading color="gray.100">Solicitações</Heading>
                <Text color="gray.100" fontSize='md'>
                     {orders.length}
                </Text>
            </HStack>


    <VStack>
        <HStack space={3} mb={3}>
                <FilterUser
                    title='Todas' 
                    type='all'
                    onPress={() => setUserFilter('all')}
                    isActive={userFiter === 'all'}
                />
                <FilterUser 
                    title='Minhas Solicitações' 
                    type='user'
                    onPress={() => setUserFilter('user')}
                    isActive={userFiter === 'user'}
                />
            </HStack>

            <HStack space={3} mb={8}>
                <Filter 
                    title='em andamento' 
                    type='open'
                    onPress={() => setStatusSelected('open')}
                    isActive={statusSelected === 'open'}
                />
                <Filter 
                    title='finalizados' 
                    type='closed'
                    onPress={() => setStatusSelected('closed')}
                    isActive={statusSelected === 'closed'}
                />
            </HStack>
    </VStack>

        { 
        isLoading ? <Loading/>  :  <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({item}) => <Order data={item} onPress={() => {handleOpenDetails(item.id)}}/>}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100}}
            ListEmptyComponent={() => (
                <Center>
                    <ChatTeardropText color={colors.gray[300]} size={40}/>
                    <Text color='gray.300' fontSize='xl' mt={5} textAlign="center">
                        Você ainda não possui {'\n'}
                        solicitações {statusSelected ==='open' ? 'em andamento' : 'finalizadas'}
                    </Text>
                </Center>
            )}
        />
        }
       
            
            <Button title='Nova solicitação' onPress={handleNewOrder}/>
        </VStack>
    </VStack>
  );
}