import { Flex, Text } from '@mantine/core';
import { UploadsCellProps } from './UploadsCells';
import { Avatar } from '@/components/UserInfo';
import { User } from '@/gql/types';
import { getNameFromObj } from '@/utils/helpers';

export const UploadsUploadedByCell = ({ info }: UploadsCellProps) => {
    const user = info.row.original.uploaded_by_user;
    return (
        <Flex align="center" gap="8px">
            <Avatar user={user as User} size={24} removeMargin />
            <Text truncate>{getNameFromObj(user)}</Text>
        </Flex>
    );
};
