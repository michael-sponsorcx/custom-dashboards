import { CXIconProps } from '@/assets/icons/IconProps';

const MusicNotePlus = ({ color, size = '16' }: CXIconProps) => (
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
            d="M14.5 18V5.589c0-.857 0-1.286.18-1.544a1 1 0 0 1 .674-.416c.312-.046.695.145 1.462.529L20.5 6m-6 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-8-8V4m-3 3h6"
        />
    </svg>
);
export default MusicNotePlus;
