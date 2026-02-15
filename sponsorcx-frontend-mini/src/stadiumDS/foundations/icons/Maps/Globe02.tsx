import { CXIconProps } from '@/assets/icons/IconProps';

const Globe02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10m0-20a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10m0-20C6.477 2 2 6.477 2 12s4.477 10 10 10m0-20c5.523 0 10 4.477 10 10s-4.477 10-10 10M2.5 9h19m-19 6h19"
        />
    </svg>
);
export default Globe02;
