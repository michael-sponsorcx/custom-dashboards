import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { SettingsCardBodyItem } from './item';
import { Children } from 'react';
import 'styled-components/macro';

export const SettingsCardBody = ({
    children,
}: {
    children?: React.ReactNode;
}): JSX.Element => {
    // Convert children to array and filter out null/undefined
    const childrenArray = Children.toArray(children).filter(Boolean);

    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                gap: 20px;
            `}
        >
            {childrenArray.map((child, index) => (
                <>
                    {child}
                    {index < childrenArray.length - 1 && (
                        <div
                            css={`
                                display: flex;
                                flex: 1 0 0;
                                border-bottom: 1px solid
                                    ${primaryColors.Gray[200]};
                            `}
                        />
                    )}
                </>
            ))}
        </div>
    );
};

SettingsCardBody.Item = SettingsCardBodyItem;
