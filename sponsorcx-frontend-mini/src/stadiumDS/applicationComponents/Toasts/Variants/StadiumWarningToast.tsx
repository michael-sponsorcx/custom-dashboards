import colors from '@/stadiumDS/foundations/colors';
import { StadiumToast } from '../StadiumToast';
import { StadiumVariantToastProps } from './StadiumToastVariants.types';
import AlertCircle from '@/stadiumDS/foundations/icons/Alerts/AlertCircle';

export const StadiumWarningToast = (props: StadiumVariantToastProps) => {
    return (
        <StadiumToast
            colorMap={colors.Warning}
            icon={<AlertCircle size="20" color={colors.Warning[600]} />}
            {...props}
        />
    );
};
