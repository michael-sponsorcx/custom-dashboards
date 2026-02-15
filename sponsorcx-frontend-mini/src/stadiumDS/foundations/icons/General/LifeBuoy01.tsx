import { CXIconProps } from '@/assets/icons/IconProps';

const LifeBuoy01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.136 8.136 4.93 3.93m0 14.142 4.239-4.239m5.693.032 4.207 4.207m0-14.142-4.24 4.24M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10m-6 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
        />
    </svg>
);
export default LifeBuoy01;
