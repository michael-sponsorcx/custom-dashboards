import { CXIconProps } from '@/assets/icons/IconProps';

const LinkBroken02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m8.5 14.5 7-7M9 3V1m6 18v2M4 8H2m18 6h2M4.914 3.914 3.5 2.5m15.586 15.586L20.5 19.5M12 16.657l-2.121 2.121a4 4 0 1 1-5.657-5.657L6.343 11m11.314 0 2.121-2.121a4 4 0 0 0-5.657-5.657L12 5.343"
        />
    </svg>
);
export default LinkBroken02;
