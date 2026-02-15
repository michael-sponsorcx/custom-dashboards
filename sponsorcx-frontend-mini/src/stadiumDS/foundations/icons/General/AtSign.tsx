import { CXIconProps } from '@/assets/icons/IconProps';

const AtSign = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 7v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94M16 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
        />
    </svg>
);
export default AtSign;
