import { CXIconProps } from '@/assets/icons/IconProps';

const Coins01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M15.938 15.938A7.001 7.001 0 0 0 15 2a7 7 0 0 0-6.938 6.062M16 15a7 7 0 1 1-14 0 7 7 0 0 1 14 0"
        />
    </svg>
);
export default Coins01;
