import { CXIconProps } from '@/assets/icons/IconProps';

const LogIn04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m12 7 4 4m0 0-4 4m4-4H3m.338-5A10 10 0 0 1 12 1c5.523 0 10 4.477 10 10s-4.477 10-10 10a10 10 0 0 1-8.662-5"
        />
    </svg>
);
export default LogIn04;
