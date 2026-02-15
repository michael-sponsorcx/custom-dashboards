import GenericSlideOutEmptyState from './GenericSlideOutEmptyState';
import Currency from '@/stadiumDS/foundations/icons/Finance/Currency';
import { useBrandPropertySpendTypes } from '@/hooks/useBrandPropertySpendTypes';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import colors from '@/stadiumDS/foundations/colors';

interface SpendSlideOutEmptyStateProps {
    onNewSpendClick: () => void;
}

const SpendSlideOutEmptyState = ({
    onNewSpendClick,
}: SpendSlideOutEmptyStateProps) => {
    const { brandSpendTypes } = useBrandPropertySpendTypes({});

    const linkRef = useRef<HTMLAnchorElement | null>(null);

    const onNewSpendTypeClick = () => {
        linkRef.current?.click();
    };

    return (
        <>
            <GenericSlideOutEmptyState
                icon={
                    <Currency
                        color={colors.Gray[700]}
                        size="16"
                        variant="dollar-circle"
                    />
                }
                title={
                    brandSpendTypes?.length
                        ? 'Add your spend'
                        : 'Missing spend fields'
                }
                description={
                    brandSpendTypes?.length
                        ? 'Start by adding a new year'
                        : 'Start by adding a new spend field'
                }
                buttonText={
                    brandSpendTypes?.length ? 'Add Year' : 'Add Spend Field'
                }
                onButtonClick={
                    brandSpendTypes?.length
                        ? onNewSpendClick
                        : onNewSpendTypeClick
                }
            />
            <Link
                ref={linkRef}
                to="/settings/values/spend-fields"
                style={{ display: 'none' }}
            />
        </>
    );
};

export default SpendSlideOutEmptyState;
