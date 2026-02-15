import { useS3Resource } from '@/hooks/useS3Resources';
import colors from '@/stadiumDS/foundations/colors';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { AssetTextTruncate } from '../components/AssetTextTruncate';
import * as SidebarStyles from './Sidebar.styles';

interface PropertyOptionRenderProps {
    option: {
        value: string | number;
        label: string;
        image?: string;
    };
    isTargetOption: boolean;
}

export const PropertyOptionRender = ({
    option,
    isTargetOption,
}: PropertyOptionRenderProps) => {
    const s3Resource = useS3Resource(option.image);

    return (
        <SidebarStyles.OptionWrapper $isSelected={isTargetOption}>
            {option.image ? (
                <img
                    src={s3Resource}
                    alt={option.label}
                    width={20}
                    height={20}
                />
            ) : (
                <Building variant="6" size="20" color={colors.Gray[400]} />
            )}
            <AssetTextTruncate text={option.label} />
        </SidebarStyles.OptionWrapper>
    );
};
