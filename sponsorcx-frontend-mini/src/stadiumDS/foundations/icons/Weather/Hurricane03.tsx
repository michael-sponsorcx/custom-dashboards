import { CXIconProps } from '@/assets/icons/IconProps';

const Hurricane03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 4H3m17 4H6m12 4H9m6 4H8m9 4h-5"
        />
    </svg>
);
export default Hurricane03;
