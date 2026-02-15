import { CXIconProps } from '@/assets/icons/IconProps';

const TrendUp02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M7 17 17 7m0 0H7m10 0v10"
        />
    </svg>
);
export default TrendUp02;
