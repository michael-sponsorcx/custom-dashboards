import { CXIconProps } from '@/assets/icons/IconProps';

const Toggle01Right = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17 16H7A5 5 0 0 1 7 6h10m0 10a5 5 0 0 0 0-10m0 10a5 5 0 0 1 0-10"
        />
    </svg>
);
export default Toggle01Right;
