import { CXIconProps } from '@/assets/icons/IconProps';

const GoogleChrome = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 0h9.17M3.95 5.06 8.54 13m2.34 7.94L15.46 13M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10"
        />
    </svg>
);
export default GoogleChrome;
