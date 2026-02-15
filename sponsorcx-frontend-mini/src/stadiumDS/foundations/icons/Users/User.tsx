import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0',
    '2': 'M12 15c-3.17 0-5.99 1.53-7.784 3.906-.386.511-.58.767-.573 1.112.005.267.172.604.382.769.272.213.649.213 1.402.213h13.146c.753 0 1.13 0 1.402-.213.21-.165.377-.502.382-.769.006-.345-.187-.6-.573-1.112C17.989 16.531 15.17 15 12 15M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9',
    '3': 'M3 20c2.336-2.477 5.507-4 9-4s6.664 1.523 9 4M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0',
};

interface UserProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const User = ({ color, size = '16', variant }: UserProps) => (
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
            d={dMap[variant]}
        />
    </svg>
);
export default User;
