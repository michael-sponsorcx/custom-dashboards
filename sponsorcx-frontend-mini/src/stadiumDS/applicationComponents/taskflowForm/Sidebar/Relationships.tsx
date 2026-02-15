import { GenericTask, TemplateConfig } from '@/gql/genericTask';
import * as S from './Relationships.styles';
import { DealNumberSelect } from './DealNumberSelect';
import { AccountSelect } from './AccountSelect';
import { PropertySelect } from './PropertySelect';
import { SidePanelSection } from '../../FormSlideOut/components/SidePanelSection';
import { useGenericTaskTemplates } from '@/hooks/useGenericTaskTemplates';

export interface RelationshipsProps {
    task?: GenericTask;
    highlightRequiredFields?: boolean;
}

export const Relationships = ({
    task,
    highlightRequiredFields,
}: RelationshipsProps) => {
    const selectedDealId = task?.relationships?.find(
        (rel) => rel.related_entity_type === 'agreement'
    )?.related_entity_id;
    const { getTemplateConfig } = useGenericTaskTemplates();
    const templateConfig = task?.template_id
        ? getTemplateConfig(task?.template_id)
        : null;

    // Get account ID from direct relationship
    // Also check related_entities as fallback (populated via JOINs when deal is selected)
    const accountRelationship = task?.relationships?.find(
        (rel) => rel.related_entity_type === 'account'
    );
    const selectedAccountId = accountRelationship?.related_entity_id;

    const selectedPropertyIds = (task?.relationships ?? [])
        .filter((rel) => rel.related_entity_type === 'property')
        .map((rel) => rel.related_entity_id);

    return (
        <SidePanelSection
            header={{
                title: 'Deal',
                info: 'The deal associated with this task',
            }}
        >
            <S.Field>
                <S.FieldValue>
                    <DealNumberSelect
                        task={task}
                        selectedAccountId={selectedAccountId}
                        selectedPropertyIds={selectedPropertyIds}
                        required={
                            templateConfig?.required_relationships?.agreement ??
                            false
                        }
                        highlightRequiredFields={highlightRequiredFields}
                    />
                </S.FieldValue>
            </S.Field>
            <S.Field>
                <S.FieldValue>
                    <PropertySelect
                        task={task}
                        selectedAccountId={selectedAccountId}
                        selectedDealId={selectedDealId}
                        dealAccountId={
                            selectedDealId ? selectedAccountId : undefined
                        }
                        required={
                            templateConfig?.required_fields?.property ?? false
                        }
                        highlightRequiredFields={highlightRequiredFields}
                    />
                </S.FieldValue>
            </S.Field>
            <S.Field>
                <S.FieldValue>
                    <AccountSelect
                        task={task}
                        selectedPropertyIds={selectedPropertyIds}
                        selectedDealId={selectedDealId}
                        required={
                            templateConfig?.required_relationships?.account ??
                            false
                        }
                        highlightRequiredFields={highlightRequiredFields}
                    />
                </S.FieldValue>
            </S.Field>
        </SidePanelSection>
    );
};
