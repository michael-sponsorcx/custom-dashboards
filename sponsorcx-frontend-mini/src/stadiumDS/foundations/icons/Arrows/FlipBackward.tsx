import { CXIconProps } from '@/assets/icons/IconProps';

const FlipBackward = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 9h13.5a4.5 4.5 0 1 1 0 9H12M3 9l4-4M3 9l4 4"
        />
    </svg>
);
export default FlipBackward;
