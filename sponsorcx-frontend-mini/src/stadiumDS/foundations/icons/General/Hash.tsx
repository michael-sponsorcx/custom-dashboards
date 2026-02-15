import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'M4 7h16M4 15h16M8 2v18m8-18v18',
    '2': 'm9.5 2-3 18m11-18-3 18m6-13h-17m16 8h-17',
};

interface HashProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Hash = ({ color, size = '16', variant }: HashProps) => (
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
export default Hash;
