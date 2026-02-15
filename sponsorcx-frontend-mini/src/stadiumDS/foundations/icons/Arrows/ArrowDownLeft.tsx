import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowDownLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17 7 7 17m0 0h10M7 17V7"
        />
    </svg>
);
export default ArrowDownLeft;
