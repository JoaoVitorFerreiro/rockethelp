import { Button as ButtonNativeBase, IButtonProps, Heading} from 'native-base';

type Props = IButtonProps &{
    title: string;
}
export function ButtonSignOut({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase 
        bg="gray.600"
        h={14}
        borderWidth={1}
        borderColor="green.500"
        fontSize="sm"
        rounded="sm"
        _pressed={{bg: "green.500"}}
        {...rest}
    >
        <Heading color="white" fontSize="sm">
            {title}
        </Heading>
    </ButtonNativeBase>
  );
}