import { CXIconProps } from '@/assets/icons/IconProps';

const ReverseLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 7h10a6 6 0 0 1 0 12H4M4 7l4-4M4 7l4 4"
        />
    </svg>
);
export default ReverseLeft;
