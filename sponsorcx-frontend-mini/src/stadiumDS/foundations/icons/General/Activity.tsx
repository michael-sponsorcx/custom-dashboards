import { CXIconProps } from '@/assets/icons/IconProps';

const Activity = ({ color, size = '16' }: CXIconProps) => (
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
            d="M22 11h-4l-3 9L9 2l-3 9H2"
        />
    </svg>
);
export default Activity;
