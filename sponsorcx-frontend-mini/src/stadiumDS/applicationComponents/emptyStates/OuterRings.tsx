import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { ReactNode } from 'react';
import 'styled-components/macro';

const OuterRings = () => {
    const outerRings: ReactNode[] = [];
    let size = 96;
    const increment = 64;
    const numRings = 6;
    const color = primaryColors.Gray[200];
    let opacity = 1;
    const opacityDecrement = 0.15;

    for (let i = 0; i < numRings; i++) {
        outerRings.push(
            <div
                key={i}
                css={`
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    border: 1px solid ${color};
                    opacity: ${opacity};
                `}
            />
        );
        size += increment;
        opacity -= opacityDecrement;
    }
    return <>{outerRings}</>;
};

export default OuterRings;
