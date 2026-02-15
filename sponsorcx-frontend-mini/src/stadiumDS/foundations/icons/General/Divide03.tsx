import { CXIconProps } from '@/assets/icons/IconProps';

const Divide03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 7h.01M12 15h.01M7 11h10m-4.5-4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m9.5-4c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10"
        />
    </svg>
);
export default Divide03;
