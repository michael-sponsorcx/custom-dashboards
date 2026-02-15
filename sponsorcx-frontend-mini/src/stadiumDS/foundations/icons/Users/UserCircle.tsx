import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const UserCircle = ({ color = colors.Gray[500], size = '16' }: CXIconProps) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5.316 19.438A4 4 0 0 1 9 17h6a4 4 0 0 1 3.684 2.438M16 9.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0m6 2.5c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10"
        />
    </svg>
);
export default UserCircle;
