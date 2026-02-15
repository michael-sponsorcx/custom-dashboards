import { CXIconProps } from '@/assets/icons/IconProps';

const Sliders02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M5 21v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-8V3m7 18v-6m0-8V3m0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 14v-4m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-8V3"
        />
    </svg>
);
export default Sliders02;
