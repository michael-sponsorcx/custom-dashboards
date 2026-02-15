import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const Eye = ({ color = colors.Gray[600], size = '16' }: CXIconProps) => (
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
            d="M2.42 11.713c-.136-.215-.204-.323-.242-.49a1.2 1.2 0 0 1 0-.446c.038-.167.106-.274.242-.49C3.546 8.505 6.895 4 12 4s8.455 4.505 9.58 6.287c.137.215.205.323.243.49.029.125.029.322 0 .446-.038.167-.106.274-.242.49C20.455 13.495 17.105 18 12 18c-5.106 0-8.455-4.505-9.58-6.287"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
        />
    </svg>
);

export default Eye;
