import { CXIconProps } from '@/assets/icons/IconProps';

const Map01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m9 18-7 4V6l7-4m0 16 7 4m-7-4V2m7 20 6-4V2l-6 4m0 16V6m0 0L9 2"
        />
    </svg>
);
export default Map01;
