import { CXIconProps } from '@/assets/icons/IconProps';

const Cloud01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6.5 19a4.5 4.5 0 0 1-.42-8.98 6.002 6.002 0 0 1 11.84 0A4.5 4.5 0 0 1 17.5 19z"
        />
    </svg>
);
export default Cloud01;
