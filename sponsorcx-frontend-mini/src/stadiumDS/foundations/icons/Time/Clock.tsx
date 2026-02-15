import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    check: 'm14.5 19 2 2 4.5-4.5m.985-3.95Q22 12.276 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.435 4.337 9.858 9.739 9.997M12 6v6l3.738 1.87',
    'fast-forward':
        'm22.7 11.5-2 2-2-2m2.245 1.5q.055-.492.055-1a9 9 0 1 0-2 5.657M12 7v5l3 2',
    plus: 'M21.92 13.265Q22 12.643 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10q.653 0 1.285-.082M12 6v6l3.738 1.87M19 22v-6m-3 3h6',
    refresh:
        'M20.453 12.893A8.5 8.5 0 0 1 4.638 16.25l-.25-.433m-.842-4.71A8.5 8.5 0 0 1 19.361 7.75l.25.433M3.493 18.066l.732-2.732 2.732.732m10.085-8.132 2.732.732.732-2.732M12 7.5V12l2.5 1.5',
    rewind: 'm22.7 13.5-2-2-2 2M21 12a9 9 0 1 1-1.245-4.57M12 7v5l3 2',
    snooze: 'M16.5 17h5l-5 5h5m.45-9q.05-.493.05-1c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10a10 10 0 0 0 1-.05M12 6v6l3.738 1.87',
    stopwatch:
        'M12 9.5v4l2.5 1.5M12 5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m0 0V2m-2 0h4m6.329 3.592-1.5-1.5.75.75m-15.908.75 1.5-1.5-.75.75',
};

interface ClockProps extends CXIconProps {
    variant?: keyof typeof dMap;
}

const Clock = ({ color, size = '16', variant }: ClockProps) => (
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
            d={
                variant
                    ? dMap[variant]
                    : 'M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10'
            }
        />
    </svg>
);
export default Clock;
