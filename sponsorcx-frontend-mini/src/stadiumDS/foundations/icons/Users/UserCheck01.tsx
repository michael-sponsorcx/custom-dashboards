import { CXIconProps } from '@/assets/icons/IconProps';

const UserCheck01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 15.5H7.5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C2 18.907 2 19.604 2 21m14-3 2 2 4-4m-7.5-8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0"
        />
    </svg>
);
export default UserCheck01;
