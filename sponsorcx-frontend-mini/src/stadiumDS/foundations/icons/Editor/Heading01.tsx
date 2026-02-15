import { CXIconProps } from '@/assets/icons/IconProps';

const Heading01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 4v16M18 4v16M8 4H4m14 8H6m2 8H4m16 0h-4m4-16h-4"
        />
    </svg>
);
export default Heading01;
