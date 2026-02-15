import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowNarrowDownRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="m6 6 12 12m0 0v-8m0 8h-8"
        />
    </svg>
);
export default ArrowNarrowDownRight;
