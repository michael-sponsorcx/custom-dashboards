import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowsLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M20 17H4m0 0 4 4m-4-4 4-4m12-6H9m0 0 4 4M9 7l4-4"
        />
    </svg>
);
export default ArrowsLeft;
