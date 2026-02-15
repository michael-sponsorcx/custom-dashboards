import { CXIconProps } from '@/assets/icons/IconProps';

const TrendDown02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m7 7 10 10m0 0V7m0 10H7"
        />
    </svg>
);
export default TrendDown02;
