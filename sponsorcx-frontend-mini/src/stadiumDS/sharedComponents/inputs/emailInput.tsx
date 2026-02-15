import Mail from '@/stadiumDS/foundations/icons/Communication/Mail';
import { StadiumInput, StadiumInputProps } from './input';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';

export const EmailInput = (
    props: Omit<StadiumInputProps, 'leftContent' | 'padding'>
) => {
    return (
        <StadiumInput
            {...props}
            leftContent={
                <Mail color={primaryColors.Gray[500]} size={'20'} variant="1" />
            }
            padding="8px 12px 8px 32px"
        />
    );
};
