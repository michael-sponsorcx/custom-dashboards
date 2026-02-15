import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '@/stadiumDS/foundations/colors';
const dMap = {
    '1': 'M4 14h6m0 0v6m0-6-7 7m17-11h-6m0 0V4m0 6 7-7',
    '2': 'M3 8h.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311C8 5.72 8 4.88 8 3.2V3M3 16h.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.31 1.311C8 18.28 8 19.12 8 20.8v.2m8-18v.2c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.31 1.311C18.28 8 19.12 8 20.8 8h.2m-5 13v-.2c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.31-1.311C18.28 16 19.12 16 20.8 16h.2',
};

interface MinimizeProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Minimize = ({
    color = colors.Gray[600],
    size = '16',
    variant,
}: MinimizeProps) => (
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

export default Minimize;
