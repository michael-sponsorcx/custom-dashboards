import { CXIconProps } from '@/assets/icons/IconProps';

const EqualNot = ({ color, size = '16' }: CXIconProps) => (
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
            d="M5 8h14M5 14h14m0-10L5 18"
        />
    </svg>
);
export default EqualNot;
