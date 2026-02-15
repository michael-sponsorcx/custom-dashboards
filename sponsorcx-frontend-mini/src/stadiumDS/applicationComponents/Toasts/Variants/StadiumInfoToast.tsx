import colors from '@/stadiumDS/foundations/colors';
import { StadiumToast } from '../StadiumToast';
import { StadiumVariantToastProps } from './StadiumToastVariants.types';
import InfoCircle from '@/stadiumDS/foundations/icons/General/InfoCircle';

export const StadiumInfoToast = (props: StadiumVariantToastProps) => {
    return (
        <StadiumToast
            colorMap={colors.Gray}
            icon={<InfoCircle size="20" color={colors.Gray[600]} />}
            {...props}
        />
    );
};
