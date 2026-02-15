import { Organization } from '@/gql/organizationGql';
import { useS3Resource } from '@/hooks/useS3Resources';
import { useTruncation } from '@/hooks/useTruncation';
import colors from '@/stadiumDS/foundations/colors';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { Tooltip } from '@mantine/core';
import 'styled-components/macro';

interface NavigationLogoProps {
    organization: Organization;
    simplifiedView: boolean;
    width: number;
}

export const NavigationLogo = ({
    organization,
    simplifiedView,
    width,
}: NavigationLogoProps) => {
    const organizationLogo = useS3Resource(organization.logo);
    const truncated = useTruncation({
        dependencies: [simplifiedView, organization.name, width],
        elementId: 'organization-name',
    });

    return (
        <Tooltip
            label={organization.name}
            disabled={!truncated && !simplifiedView}
            withinPortal
        >
            <div
                css={`
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    padding: 0px ${simplifiedView ? 0 : 4}px;
                    width: 100%;
                    align-items: center;
                    justify-content: ${simplifiedView
                        ? 'center'
                        : 'flex-start'};
                `}
            >
                {organization.logo ? (
                    <img
                        src={organizationLogo}
                        alt={organization.name}
                        width={32}
                        height={32}
                        css={`
                            border-radius: 8px;
                            object-fit: contain;
                            overflow: hidden;
                        `}
                    />
                ) : (
                    <Building variant="7" size="32" color={colors.Gray[300]} />
                )}
                {!simplifiedView && (
                    <div
                        id="organization-name"
                        css={`
                            font-size: 18px;
                            font-weight: 700;
                            color: ${colors.Base.Black};
                            max-width: calc(100% - 40px);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        `}
                    >
                        {organization.name}
                    </div>
                )}
            </div>
        </Tooltip>
    );
};
