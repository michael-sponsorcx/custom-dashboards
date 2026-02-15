import { CXIconProps } from '@/assets/icons/IconProps';

const Translate01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12.913 16h7.174m-7.174 0L11 20m1.913-4 2.865-5.991c.231-.483.347-.724.505-.8a.5.5 0 0 1 .434 0c.158.076.274.317.505.8L20.087 16m0 0L22 20M2 4h6m0 0h3.5M8 4V2m3.5 2H14m-2.5 0c-.496 2.957-1.647 5.636-3.334 7.884M10 13a9.4 9.4 0 0 1-1.834-1.116m0 0C6.813 10.848 5.603 9.427 5 8m3.166 3.884A17.3 17.3 0 0 1 2 17"
        />
    </svg>
);
export default Translate01;
