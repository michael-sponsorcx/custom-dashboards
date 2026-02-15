import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowCircleBrokenDownRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.41 2.34a10 10 0 0 1 9.661 2.589c3.905 3.905 3.905 10.237 0 14.142s-10.237 3.905-14.142 0a10 10 0 0 1-2.59-9.66M15 9v6m0 0H9m6 0L5 5"
        />
    </svg>
);
export default ArrowCircleBrokenDownRight;
