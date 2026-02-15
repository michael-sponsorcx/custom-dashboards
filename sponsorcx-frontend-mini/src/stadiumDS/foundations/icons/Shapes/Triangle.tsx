import { CXIconProps } from '@/assets/icons/IconProps';

const Triangle = ({ color, size = '16' }: CXIconProps) => (
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
            d="m2.39 18.098 8.225-14.206c.455-.785.682-1.178.979-1.31a1 1 0 0 1 .812 0c.297.132.524.525.978 1.31l8.225 14.206c.456.788.685 1.182.65 1.506a1 1 0 0 1-.406.705c-.263.191-.718.191-1.628.191H3.775c-.91 0-1.366 0-1.629-.191a1 1 0 0 1-.406-.705c-.034-.324.194-.718.65-1.506"
        />
    </svg>
);
export default Triangle;
