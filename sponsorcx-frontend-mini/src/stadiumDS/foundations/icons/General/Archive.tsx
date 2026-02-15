import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '@/stadiumDS/foundations/colors';

const Archive = ({ color = colors.Gray[600], size = '16' }: CXIconProps) => (
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
            d="M4 6.997a2.3 2.3 0 0 1-.39-.035A2 2 0 0 1 2.038 5.39C2 5.197 2 4.965 2 4.5s0-.697.038-.89A2 2 0 0 1 3.61 2.038C3.803 2 4.035 2 4.5 2h15c.465 0 .697 0 .89.038a2 2 0 0 1 1.572 1.572c.038.193.038.425.038.89s0 .697-.038.89a2 2 0 0 1-1.572 1.572c-.107.02-.226.03-.39.035M10 12h4M4 7h16v8.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 20 16.88 20 15.2 20H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 17.72 4 16.88 4 15.2z"
        />
    </svg>
);
export default Archive;
