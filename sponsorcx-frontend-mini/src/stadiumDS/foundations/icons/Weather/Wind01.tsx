import { CXIconProps } from '@/assets/icons/IconProps';

const Wind01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 18s-1.19-.47-2-.698c-5.12-1.445-8.88 2.84-14 1.396C4.19 18.469 3 18 3 18m18-6s-1.19-.47-2-.698c-5.12-1.445-8.88 2.84-14 1.396C4.19 12.469 3 12 3 12m18-6s-1.19-.47-2-.698c-5.12-1.445-8.88 2.84-14 1.396C4.19 6.47 3 6 3 6"
        />
    </svg>
);
export default Wind01;
