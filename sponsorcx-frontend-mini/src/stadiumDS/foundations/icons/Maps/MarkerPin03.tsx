import { CXIconProps } from '@/assets/icons/IconProps';

const MarkerPin03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 22c1-5 8-5.582 8-12a8 8 0 1 0-16 0c0 6.418 7 7 8 12"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
        />
    </svg>
);
export default MarkerPin03;
