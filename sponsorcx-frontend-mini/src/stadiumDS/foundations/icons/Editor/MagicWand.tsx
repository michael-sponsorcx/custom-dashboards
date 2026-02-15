import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    '1': 'm13 14-3-3m5.01-7.5V2m3.94 3.06L20.01 4m-1.06 9 1.06 1.06m-9-9L9.95 4m10.56 5h1.5M6.131 20.869l9.238-9.238c.396-.396.594-.594.668-.822a1 1 0 0 0 0-.618c-.074-.228-.272-.426-.668-.822l-.737-.738c-.397-.396-.595-.594-.823-.668a1 1 0 0 0-.618 0c-.228.074-.426.272-.822.668L3.13 17.87c-.396.396-.594.594-.668.822a1 1 0 0 0 0 .618c.074.228.272.426.668.822l.738.738c.396.396.594.594.822.668a1 1 0 0 0 .618 0c.228-.074.426-.272.822-.668',
    '2': 'M15 4V2m0 14v-2M8 9h2m10 0h2m-4.2 2.8L19 13m-1.2-6.8L19 5M3 21l9-9m.2-5.8L11 5',
};

interface MagicWandProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const MagicWand = ({ color, size = '16', variant }: MagicWandProps) => (
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
export default MagicWand;
