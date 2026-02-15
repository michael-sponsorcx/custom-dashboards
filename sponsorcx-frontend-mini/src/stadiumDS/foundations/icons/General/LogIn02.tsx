import { CXIconProps } from '@/assets/icons/IconProps';

const LogIn02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 16c0 .93 0 1.395.102 1.776a3 3 0 0 0 2.122 2.122C8.605 20 9.07 20 10 20h6.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 17.72 21 16.88 21 15.2V6.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 2 17.88 2 16.2 2H10c-.93 0-1.395 0-1.776.102a3 3 0 0 0-2.122 2.122C6 4.605 6 5.07 6 6m6 1 4 4m0 0-4 4m4-4H3"
        />
    </svg>
);
export default LogIn02;
