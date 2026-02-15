import { CXIconProps } from '@/assets/icons/IconProps';

const Speedometer04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17.745 15a7.027 7.027 0 0 0 1.094-5.5M6.255 15a7 7 0 0 1 6.982-10.891M16.5 6.5 12 11m10 0c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10m-9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        />
    </svg>
);
export default Speedometer04;
