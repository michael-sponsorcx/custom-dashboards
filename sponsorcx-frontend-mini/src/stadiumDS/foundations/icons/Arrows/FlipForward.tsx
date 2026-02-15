import { CXIconProps } from '@/assets/icons/IconProps';

const FlipForward = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 9H7.5a4.5 4.5 0 1 0 0 9H12m9-9-4-4m4 4-4 4"
        />
    </svg>
);
export default FlipForward;
