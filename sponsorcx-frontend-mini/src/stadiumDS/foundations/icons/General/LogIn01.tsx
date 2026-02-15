import { CXIconProps } from '@/assets/icons/IconProps';

const LogIn01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M15 2h1.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 4.28 21 5.12 21 6.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 20 17.88 20 16.2 20H15M10 6l5 5m0 0-5 5m5-5H3"
        />
    </svg>
);
export default LogIn01;
