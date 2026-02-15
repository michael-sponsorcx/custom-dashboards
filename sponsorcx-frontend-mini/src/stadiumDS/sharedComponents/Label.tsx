import { Flex, Text, TextProps } from '@mantine/core';
import { PropsWithChildren } from 'react';
import colors from '../foundations/colors';
import { StadiumRequiredIndicator } from './RequiredIndicator/StadiumRequiredIndicator';

interface LabelProps extends TextProps {
    required?: boolean;
}

const Label = ({
    children,
    required = false,
    ...props
}: PropsWithChildren<LabelProps>) => (
    <Flex gap={2}>
        <Text
            size="md"
            fw={500}
            c={colors.Gray[700]}
            style={{ marginBottom: '5px' }}
            {...props}
        >
            {children}
        </Text>
        {required && <StadiumRequiredIndicator />}
    </Flex>
);

export default Label;
