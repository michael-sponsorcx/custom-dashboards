import { CXIconProps } from '@/assets/icons/IconProps';

const Menu03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 11h18M3 5h18M3 17h12"
        />
    </svg>
);
export default Menu03;
