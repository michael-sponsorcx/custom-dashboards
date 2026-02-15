import { CXIconProps } from '@/assets/icons/IconProps';

const CoinsSwap01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m6 6 2-2m0 0L6 2m2 2H6a4 4 0 0 0-4 4m16 10-2 2m0 0 2 2m-2-2h2a4 4 0 0 0 4-4m-8.583-2.583a6 6 0 1 0-2.834-2.834M14 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0"
        />
    </svg>
);
export default CoinsSwap01;
