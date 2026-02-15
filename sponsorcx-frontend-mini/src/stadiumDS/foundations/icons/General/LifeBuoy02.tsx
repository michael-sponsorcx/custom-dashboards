import { CXIconProps } from '@/assets/icons/IconProps';

const LifeBuoy02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M8.464 7.464 4.93 3.93m0 14.142 3.535-3.536m7.072 0 3.535 3.536m0-14.142-3.536 3.535M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10m-5 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
        />
    </svg>
);
export default LifeBuoy02;
