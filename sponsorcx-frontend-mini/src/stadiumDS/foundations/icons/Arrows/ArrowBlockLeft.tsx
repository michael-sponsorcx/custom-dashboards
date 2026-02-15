import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowBlockLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="m3 12 7-7v4h10.2c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218C21 9.38 21 9.52 21 9.8v4.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C20.62 15 20.48 15 20.2 15H10v4z"
        />
    </svg>
);
export default ArrowBlockLeft;
