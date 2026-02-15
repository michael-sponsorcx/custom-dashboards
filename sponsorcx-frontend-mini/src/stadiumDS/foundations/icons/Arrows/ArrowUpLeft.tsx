import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowUpLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17 17 7 7m0 0v10M7 7h10"
        />
    </svg>
);
export default ArrowUpLeft;
