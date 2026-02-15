import colors from '@/stadiumDS/foundations/colors';
import { StadiumToast } from '../StadiumToast';
import { StadiumVariantToastProps } from './StadiumToastVariants.types';
import Check from '@/stadiumDS/foundations/icons/General/Check';

export const StadiumSuccessToast = (props: StadiumVariantToastProps) => {
    return (
        <StadiumToast
            colorMap={colors.Success}
            icon={
                <Check variant="circle" size="20" color={colors.Success[600]} />
            }
            {...props}
        />
    );
};
