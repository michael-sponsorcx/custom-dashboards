import { CXIconProps } from '@/assets/icons/IconProps';
import colors from '../../colors';

const dMap = {
    '1': 'm2 12 9.642 4.821c.131.066.197.099.266.111q.091.018.184 0c.069-.012.135-.045.266-.11L22 12M2 17l9.642 4.821c.131.066.197.099.266.111q.091.018.184 0c.069-.012.135-.045.266-.11L22 17M2 7l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.11L22 7l-9.642 4.821c-.131.066-.197.099-.266.111a.5.5 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11z',
    '2': 'M7 9.5 2 12l9.642 4.821c.131.066.197.099.266.111q.091.018.184 0c.069-.012.135-.045.266-.11L22 12l-5-2.5m-10 5L2 17l9.642 4.821c.131.066.197.099.266.111q.091.018.184 0c.069-.012.135-.045.266-.11L22 17l-5-2.5M2 7l9.642-4.821c.131-.066.197-.098.266-.111a.5.5 0 0 1 .184 0c.069.013.135.045.266.11L22 7l-9.642 4.821c-.131.066-.197.099-.266.111a.5.5 0 0 1-.184 0c-.069-.012-.135-.045-.266-.11z',
};

interface LayersThreeProps extends CXIconProps {
    variant?: keyof typeof dMap;
}

const LayersThree = ({
    color = colors.Gray[600],
    size = '16',
    variant = '1',
}: LayersThreeProps) => (
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

export default LayersThree;
