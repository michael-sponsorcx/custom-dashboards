import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowCircleBrokenUpRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="M2.34 14.59a10 10 0 0 1 2.589-9.661c3.905-3.905 10.237-3.905 14.142 0s3.905 10.237 0 14.142a10 10 0 0 1-9.66 2.59M15 15V9m0 0H9m6 0L5 19"
        />
    </svg>
);
export default ArrowCircleBrokenUpRight;
