import { CXIconProps } from '@/assets/icons/IconProps';

const Loading02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 1v4m0 12v4M6 11H2m20 0h-4m1.078 7.078L16.25 15.25M19.078 4 16.25 6.828M4.922 18.078 7.75 15.25M4.922 4 7.75 6.828"
        />
    </svg>
);
export default Loading02;
