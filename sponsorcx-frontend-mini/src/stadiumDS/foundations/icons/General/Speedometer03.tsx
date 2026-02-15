import { CXIconProps } from '@/assets/icons/IconProps';

const Speedometer03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M5 11a7 7 0 0 1 7-7m4.5 2.5L12 11m10 0c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10m-9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        />
    </svg>
);
export default Speedometer03;
