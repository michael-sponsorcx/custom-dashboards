import { CXIconProps } from '@/assets/icons/IconProps';

const Hurricane02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M18 12a6 6 0 0 1-12 0m12 0a6 6 0 0 0-12 0m12 0a8 8 0 1 1-16 0m4 0a8 8 0 1 1 16 0m-9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        />
    </svg>
);
export default Hurricane02;
