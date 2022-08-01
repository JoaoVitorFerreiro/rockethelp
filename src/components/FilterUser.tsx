import { Text, Button, IButtonProps, useTheme } from 'native-base';

type Props = IButtonProps & {
    title: string;
    isActive?: boolean;
    type: 'all' | 'user';
}

export function FilterUser({title, isActive = false, type, ...rest}: Props) {
    const { colors } = useTheme();

    const colorType = colors.purple[500];

    return (
    <Button
        variant="outline"
        borderWidth={isActive ? 1 : 0}
        borderColor={colorType}
        bg="gray.600"
        flex={1}
        size="sm"
        {...rest}
    >
        <Text color={isActive ? colorType : "gray.300"} fontSize="xs" textTransform="uppercase">
            {title}
        </Text>
    </Button>
  );
}