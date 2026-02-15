import { UploadNode } from '@/hooks/useUniversalUploadList';
import { UploadContent } from '@/stadiumDS/applicationComponents/UploadContent/UploadContent';
import colors from '@/stadiumDS/foundations/colors';
import Paperclip from '@/stadiumDS/foundations/icons/General/Paperclip';
import { Flex, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';

interface PropertyUploadsCellProps<T> {
    canEdit?: boolean;
    itemLabel?: string;
    item: T;
    onUploadClick: (item: T) => void;
    attachments: UploadNode[];
}

export const PropertyUploadsCell = <T,>({
    canEdit,
    itemLabel = 'item',
    item,
    onUploadClick,
    attachments,
}: PropertyUploadsCellProps<T>) => {
    return (
        <Tooltip
            label={`Upload to ${itemLabel}`}
            withinPortal
            disabled={!canEdit}
        >
            <UnstyledButton
                onClick={() => onUploadClick(item)}
                disabled={!canEdit}
                style={{ cursor: !canEdit ? 'not-allowed' : 'pointer' }}
            >
                {attachments?.length ? (
                    <Group
                        wrap="nowrap"
                        gap="4px"
                        style={{ overflow: 'hidden' }}
                    >
                        {attachments.map((attachment, index) => {
                            if (index > 2) {
                                return null;
                            }
                            if (index === 2 && attachments.length > 3) {
                                return (
                                    <Flex
                                        key={`upload-cell-${attachment.id}-${index}`}
                                        justify="center"
                                        align="center"
                                        style={{
                                            height: '25px',
                                            width: '25px',
                                            borderRadius: '6px',
                                            backgroundColor: colors.Gray[200],
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                color: colors.Gray[700],
                                            }}
                                        >
                                            +{attachments.length - 2}
                                        </Text>
                                    </Flex>
                                );
                            }
                            return (
                                <Flex
                                    key={`upload-cell-${attachment.id}-${index}`}
                                    justify="center"
                                    align="center"
                                    style={{
                                        height: '25px',
                                        width: '25px',
                                    }}
                                >
                                    <UploadContent
                                        upload={attachment}
                                        borderRadius="4px"
                                        playIconSize="16"
                                        documentScale={0.6}
                                    />
                                </Flex>
                            );
                        })}
                    </Group>
                ) : (
                    <Paperclip color={colors.Gray[400]} size="16" />
                )}
            </UnstyledButton>
        </Tooltip>
    );
};
