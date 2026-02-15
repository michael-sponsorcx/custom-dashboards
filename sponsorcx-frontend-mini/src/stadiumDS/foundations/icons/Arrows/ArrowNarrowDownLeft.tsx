import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowNarrowDownLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M18 6 6 18m0 0h8m-8 0v-8"
        />
    </svg>
);
export default ArrowNarrowDownLeft;
