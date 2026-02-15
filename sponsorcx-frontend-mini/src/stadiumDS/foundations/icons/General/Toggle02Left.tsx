import { CXIconProps } from '@/assets/icons/IconProps';

const Toggle02Left = ({ color, size = '16' }: CXIconProps) => (
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
            d="M10 15h8a4 4 0 0 0 0-8h-8m2 4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
        />
    </svg>
);
export default Toggle02Left;
