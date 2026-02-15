import { CXIconProps } from '@/assets/icons/IconProps';

const Type01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 7c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.083-1.083C5.602 4 6.068 4 7 4h10c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C20 5.602 20 6.068 20 7M9 20h6M12 4v16"
        />
    </svg>
);
export default Type01;
