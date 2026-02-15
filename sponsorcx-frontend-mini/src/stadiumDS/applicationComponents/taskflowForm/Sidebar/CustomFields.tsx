import { GenericTask } from '@/gql/genericTask';
import * as S from './CustomFields.styles';
import { FieldLabelText } from './FieldLabelText';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';
import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import colors from '@/stadiumDS/foundations/colors';
import { useState } from 'react';
import { SidePanelSection } from '../../FormSlideOut/components/SidePanelSection';

interface CustomFieldsProps {
    task: GenericTask | undefined;
    highlightRequiredFields?: boolean;
}

export const CustomFields = ({
    task,
    highlightRequiredFields,
}: CustomFieldsProps) => {
    const [isEditingCustomFields, setIsEditingCustomFields] = useState(false);

    return (
        <SidePanelSection
            header={{
                title: 'Custom Fields',
                info: 'The custom fields associated with this task',
            }}
        >
            <S.Field>
                <S.FieldValue>
                    <S.FieldLabel
                        // $highlight={
                        //     highlightRequiredFields &&
                        //     !task?.custom_fields?.length
                        // }
                        onClick={() => setIsEditingCustomFields(true)}
                        role="button"
                        aria-label="Custom Fields"
                    >
                        <FieldLabelText>Custom Field</FieldLabelText>
                        <S.EmptyPlusContainer>
                            <Plus size="16" color={colors.Gray[400]} />
                        </S.EmptyPlusContainer>
                    </S.FieldLabel>
                </S.FieldValue>
            </S.Field>
        </SidePanelSection>
    );
};
