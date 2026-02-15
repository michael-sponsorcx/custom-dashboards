import { CXIconProps } from '@/assets/icons/IconProps';

const Target05 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11s4.477 10 10 10"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
        />
    </svg>
);
export default Target05;
