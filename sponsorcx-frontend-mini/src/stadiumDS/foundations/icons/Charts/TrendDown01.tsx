import { CXIconProps } from '@/assets/icons/IconProps';

const TrendDown01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m22 17-7.869-7.869c-.396-.396-.594-.594-.822-.668a1 1 0 0 0-.618 0c-.228.074-.426.272-.822.668L9.13 11.87c-.396.396-.594.594-.822.668a1 1 0 0 1-.618 0c-.228-.074-.426-.272-.822-.668L2 7m20 10h-7m7 0v-7"
        />
    </svg>
);
export default TrendDown01;
