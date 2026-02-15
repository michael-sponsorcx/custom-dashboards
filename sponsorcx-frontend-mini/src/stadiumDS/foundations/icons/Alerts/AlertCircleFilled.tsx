import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const AlertCircleFilled = ({
    color = colors.Base.Black,
    strokeColor = colors.Base.White,
    size = '24',
}: CXIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 21C17.5228 21 22 16.5228 22 11C22 5.47715 17.5228 1 12 1C6.47715 1 2 5.47715 2 11C2 16.5228 6.47715 21 12 21Z"
            fill={color}
        />
        <path
            d="M12 7V11M12 15H12.01"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default AlertCircleFilled;
