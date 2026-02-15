import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    circle: 'm15 8-6 6m0-6 6 6m7-3c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10',
    close: 'M18 5 6 17M6 5l12 12',
    square: 'm9 8 6 6m0-6-6 6m-1.2 6h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 17.72 21 16.88 21 15.2V6.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 2 17.88 2 16.2 2H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 4.28 3 5.12 3 6.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 20 6.12 20 7.8 20',
};

interface XProps extends CXIconProps {
    variant?: keyof typeof dMap;
}

const X = ({ color, size = '16', variant }: XProps) => (
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
            d={variant ? dMap[variant] : 'M17 6 7 16M7 6l10 10'}
        />
    </svg>
);
export default X;
