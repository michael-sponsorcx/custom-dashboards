import { CXIconProps } from '@/assets/icons/IconProps';

const Anchor = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 0v14m0 0A10 10 0 0 1 2 11h3m7 10a10 10 0 0 0 10-10h-3"
        />
    </svg>
);
export default Anchor;
