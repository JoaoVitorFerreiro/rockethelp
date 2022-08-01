import { useNavigation } from '@react-navigation/native';
import { Box, Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base';
import { CaretLeft, Trash } from 'phosphor-react-native';
import { Alert } from 'react-native';

import firestore from '@react-native-firebase/firestore'


type Props = StyledProps &{
    title:string;
}

type OrderPropsDelete = Props & {
    id?: string;
    patrimony?: string;
    showDeleteButton?: boolean;
}

export function Header({
    title, 
    id, 
    patrimony, 
    showDeleteButton = false, 
    ...rest
} : OrderPropsDelete) {
    const { colors } = useTheme();
    const navigation = useNavigation();

    function handleGoBack(){
        navigation.goBack()
    }
    
    function handleDeleteOrder(id: string) {
        firestore()
        .collection('orders')
        .doc(id)
        .delete()
        .then(() => {
            Alert.alert("Solicitação excluida com sucesso")
            navigation.goBack();
        })
    }



    function handleConfirmDelete(id: string, patrimony: string) {
        {Alert.alert(`Você deseja deletar o patrimônio ${String(patrimony)}`,
        "",
        [
          {text: 'Cancelar', },
          {text: 'Deletar', onPress: () => handleDeleteOrder(id) },
        ],
        {cancelable: false},
    )}
    }

    return (
    <HStack
        w='full'
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pb={6}
        pt={12}
    >
        <IconButton
            icon={<CaretLeft color={colors.gray[200]} size={24}/>}
            onPress={handleGoBack}
        />
        
        <Heading color="gray.100" textAlign="center" fontSize='lg' ml={showDeleteButton ? 0 : -6} flex={1}>
            {title}
        </Heading>

        {
            showDeleteButton 
            ? <IconButton
                icon={<Trash color={colors.gray[200]} size={24}/>}
                onPress={() => handleConfirmDelete(id,patrimony)}
            /> 
            : <Box/> 
        }
        
    </HStack>
  );
}