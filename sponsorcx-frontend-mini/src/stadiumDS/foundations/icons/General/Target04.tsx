import { CXIconProps } from '@/assets/icons/IconProps';

const Target04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 7V4l3-3 1 2 2 1-3 3zm0 0-4 4m10 0c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1m5 10a5 5 0 1 1-5-5"
        />
    </svg>
);
export default Target04;
