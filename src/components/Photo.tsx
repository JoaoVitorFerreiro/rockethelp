import { 
    VStack,
    Button,
    IButtonProps,
    Text,
    Image
} from 'native-base';


type Props = IButtonProps & {
    uri?: string;
  }

export function Photo({uri, ...rest}: Props) {
  return (
        <Button 
            bg="white" 
            h={250}
            w={250}
            borderRadius={125}
            mt={5} 
            mb={12} 
            _pressed={{bg: "green.500"}}
            {...rest}
        >
                    {
                        uri ? <Image 
                                flex={1} 
                                size={250} 
                                source={{uri}} 
                                borderRadius={125} 
                                alt="Nenhuma Cadastrada nesse perfil"/> 
                        : (
                            <VStack>
                                <Text>
                                    Nenhuma Cadastrada nesse perfil
                                </Text>
                            </VStack>
                        )
                    }
        </Button>
  );
}