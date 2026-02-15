import { CXIconProps } from '@/assets/icons/IconProps';

const Translate02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m5 7 5 5m-6 1 6-6 2-3M2 4h12M7 1h1m4.913 15h7.174m-7.174 0L11 20m1.913-4 2.865-5.991c.231-.483.347-.724.505-.8a.5.5 0 0 1 .434 0c.158.076.274.317.505.8L20.087 16m0 0L22 20"
        />
    </svg>
);
export default Translate02;
