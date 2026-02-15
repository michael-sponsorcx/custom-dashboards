import { CXIconProps } from '@/assets/icons/IconProps';

const Coins04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M10.101 4A7 7 0 0 1 20 13.899M7.5 13 9 12v5.5m-1.5 0h3M16 15a7 7 0 1 1-14 0 7 7 0 0 1 14 0"
        />
    </svg>
);
export default Coins04;
