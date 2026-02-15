import { CXIconProps } from '@/assets/icons/IconProps';

const TypeStrikethrough01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 7V6c0-.541.215-1.032.564-1.392M9 20h6m-3-8v8M3 3l18 18M9.5 4H17c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C20 5.602 20 6.068 20 7m-8-3v2.5"
        />
    </svg>
);
export default TypeStrikethrough01;
