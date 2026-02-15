import { SlideOut } from '@/stadiumDS/sharedComponents/SlideOut';
import { AgreementHistory } from './AgreementHistory';
import { Agreement } from '@/gql/agreementGql';
import { Box, Divider, Tooltip } from '@mantine/core';
import { CloseX } from '@/assets/icons/CloseX';
import { AgreementHistoryExportLink } from './AgreementHistoryExportLink';

interface AgreementHistorySlideOutProps {
    isOpen: boolean;
    onClose: () => void;
    agreement: Agreement;
}

export const AgreementHistorySlideOut = ({
    isOpen,
    onClose,
    agreement,
}: AgreementHistorySlideOutProps) => {
    return (
        <SlideOut
            isOpen={isOpen}
            onClose={onClose}
            width="554px"
            minWidth="554px"
            maxWidth="554px"
            hideCloseButton
            noBodyPadding
        >
            {isOpen && (
                <>
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <AgreementHistoryExportLink agreement={agreement} />
                        <Tooltip
                            label="Close"
                            zIndex={2000}
                            withinPortal
                            withArrow
                        >
                            <Box
                                onClick={onClose}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingRight: '16px',
                                    paddingTop: '6px',
                                    paddingBottom: '6px',
                                    height: '30px',
                                }}
                            >
                                <CloseX color="gray" size="14" />
                            </Box>
                        </Tooltip>
                    </Box>
                    <Divider mb="lg" />
                    <AgreementHistory agreement={agreement} />
                </>
            )}
        </SlideOut>
    );
};
