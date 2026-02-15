import { CXIconProps } from '@/assets/icons/IconProps';

const ReverseRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="M20 7H10a6 6 0 1 0 0 12h10m0-12-4-4m4 4-4 4"
        />
    </svg>
);
export default ReverseRight;
