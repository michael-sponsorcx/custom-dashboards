import colors from '@/stadiumDS/foundations/colors';
import { StadiumToast } from '../StadiumToast';
import { StadiumVariantToastProps } from './StadiumToastVariants.types';
import AlertCircle from '@/stadiumDS/foundations/icons/Alerts/AlertCircle';

export const StadiumErrorToast = (props: StadiumVariantToastProps) => {
    return (
        <StadiumToast
            colorMap={colors.Error}
            icon={<AlertCircle size="20" color={colors.Error[600]} />}
            {...props}
        />
    );
};
