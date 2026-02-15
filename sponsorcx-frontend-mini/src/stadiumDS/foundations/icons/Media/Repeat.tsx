import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const dMap = {
    '01': 'm17 2 4 4m0 0-4 4m4-4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 8.28 3 9.12 3 10.8v.2m0 7h13.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 15.72 21 14.88 21 13.2V13M3 18l4 4m-4-4 4-4',
    '02': 'm11 2 3 3m0 0-3 3m3-3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 7.28 2 8.12 2 9.8v5.7c0 .464 0 .697.026.892a3 3 0 0 0 2.582 2.582c.195.026.428.026.892.026m4.5 0h7.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 16.72 22 15.88 22 14.2V8.5c0-.464 0-.697-.026-.892a3 3 0 0 0-2.582-2.582C19.197 5 18.964 5 18.5 5M10 19l3 3m-3-3 3-3',
    '03': 'm13 22-3-3m0 0 3-3m-3 3h5a7 7 0 0 0 3-13.326M6 18.326A7 7 0 0 1 9 5h5m0 0-3-3m3 3-3 3',
    '04': 'M12 20.5a8.5 8.5 0 0 0 5-15.375M13 22.4l-2-2 2-2M12 3.5a8.5 8.5 0 0 0-5 15.375M11 5.6l2-2-2-2',
};

interface RepeatProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Repeat = ({
    color = colors.Gray[600],
    size = '16',
    variant,
}: RepeatProps) => {
    if (!variant || !dMap[variant]) return null;
    return (
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
};
export default Repeat;
