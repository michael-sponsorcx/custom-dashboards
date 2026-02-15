import { CXIconProps } from '@/assets/icons/IconProps';

const Italic01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M19 4h-9m4 16H5M15 4 9 20"
        />
    </svg>
);
export default Italic01;
