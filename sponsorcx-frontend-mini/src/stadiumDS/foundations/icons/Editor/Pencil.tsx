import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const dMap = {
    '1': 'm2.5 21.5 5.55-2.134c.354-.137.532-.205.698-.294q.221-.12.42-.274c.149-.115.283-.25.552-.518L21 7a2.828 2.828 0 1 0-4-4L5.72 14.28c-.269.268-.403.403-.519.552a3 3 0 0 0-.273.42c-.089.166-.157.344-.294.699zm0 0 2.058-5.351c.147-.383.221-.575.347-.662a.5.5 0 0 1 .38-.08c.15.028.295.173.585.463l2.26 2.26c.29.29.435.434.464.585a.5.5 0 0 1-.08.38c-.089.126-.28.2-.663.347z',
    '2': 'm18 2 4 4M2 22l1.276-4.68c.084-.305.125-.458.19-.6q.085-.19.207-.36c.092-.125.204-.237.428-.46L14.434 5.565c.198-.198.297-.297.412-.334a.5.5 0 0 1 .309 0c.114.037.213.136.41.334l2.87 2.868c.197.198.296.297.333.411.033.1.033.21 0 .31-.037.114-.136.213-.334.41L8.101 19.9c-.224.224-.336.336-.462.428a2 2 0 0 1-.358.208c-.143.064-.296.105-.6.189z',
};

interface PencilProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Pencil = ({
    color = colors.Gray[600],
    size = '16',
    variant,
}: PencilProps) => (
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

export default Pencil;
