import { CXIconProps } from '@/assets/icons/IconProps';

const Contrast03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 8.5a7.5 7.5 0 0 1-9.284 7.287 6.5 6.5 0 1 0 9.07-9.07q.212.858.214 1.783"
        />
    </svg>
);
export default Contrast03;
