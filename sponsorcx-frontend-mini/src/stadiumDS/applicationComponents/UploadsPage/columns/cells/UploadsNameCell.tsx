import { Flex, Text } from '@mantine/core';
import { UploadContent } from '@/stadiumDS/applicationComponents/UploadContent/UploadContent';
import { UploadsCellProps } from './UploadsCells';

export const UploadsNameCell = ({ info }: UploadsCellProps): JSX.Element => {
    const upload = info.row.original;

    return (
        <Flex align="center" gap={12}>
            <Flex
                align="center"
                justify="center"
                style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                }}
            >
                <UploadContent
                    upload={upload}
                    borderRadius="4px"
                    documentScale={0.8}
                />
            </Flex>
            <Text truncate>
                {upload.display_name || upload.original_filename}
            </Text>
        </Flex>
    );
};
