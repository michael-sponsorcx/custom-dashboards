import { CXIconProps } from '@/assets/icons/IconProps';

const Target01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M22 11c0 5.523-4.477 10-10 10m10-10c0-5.523-4.477-10-10-10m10 10h-4m-6 10C6.477 21 2 16.523 2 11m10 10v-4M2 11C2 5.477 6.477 1 12 1M2 11h4m6-10v4"
        />
    </svg>
);
export default Target01;
