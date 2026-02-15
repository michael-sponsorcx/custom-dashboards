import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowDown = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 5v14m0 0 7-7m-7 7-7-7"
        />
    </svg>
);
export default ArrowDown;
