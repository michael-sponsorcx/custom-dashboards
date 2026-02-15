import { CXIconProps } from '@/assets/icons/IconProps';

const SpacingHeight02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 3H3m18 18H3m9-3.5v-11m3 0H9m6 11H9"
        />
    </svg>
);
export default SpacingHeight02;
