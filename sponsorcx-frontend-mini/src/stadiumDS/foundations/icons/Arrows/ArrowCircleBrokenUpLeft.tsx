import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowCircleBrokenUpLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M14.59 21.66a10 10 0 0 1-9.661-2.589c-3.905-3.905-3.905-10.237 0-14.142s10.237-3.905 14.142 0a10 10 0 0 1 2.59 9.66M9 15V9m0 0h6M9 9 19 19"
        />
    </svg>
);
export default ArrowCircleBrokenUpLeft;
