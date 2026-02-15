import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';
import { SettingsCardHeader } from './header';
import { SettingsCardBody } from './body';

export const SettingsCard = ({
    children,
}: {
    children?: React.ReactNode;
}): JSX.Element => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                padding: 32px;
                gap: 24px;
                width: 100%;
                border-radius: 16px;
                background: ${primaryColors.Gray[50]};
                height: fit-content;
                overflow: auto;
                max-height: 100%;
                scrollbar-width: thin;
            `}
        >
            {children}
        </div>
    );
};

SettingsCard.Header = SettingsCardHeader;
SettingsCard.Body = SettingsCardBody;
