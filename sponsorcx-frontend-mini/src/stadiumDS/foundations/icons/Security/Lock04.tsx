import { CXIconProps } from '@/assets/icons/IconProps';

const Lock04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M7.101 10H7V8a5 5 0 0 1 10 0v2h-.101M12 14v2m7-1a7 7 0 1 1-14 0 7 7 0 0 1 14 0"
        />
    </svg>
);
export default Lock04;
