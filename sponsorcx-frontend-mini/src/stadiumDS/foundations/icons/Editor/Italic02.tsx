import { CXIconProps } from '@/assets/icons/IconProps';

const Italic02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m13.25 4-6 16m9.5-16-6 16M19.5 4h-10m5 16h-10"
        />
    </svg>
);
export default Italic02;
