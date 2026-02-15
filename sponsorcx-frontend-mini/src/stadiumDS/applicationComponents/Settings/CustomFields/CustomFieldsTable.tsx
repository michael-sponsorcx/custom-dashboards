import {
    CustomField,
    customFieldDelete,
    customFieldsUpdateOrder,
    ValueType,
} from '@/gql/customFieldGql';
import { useMutation } from '@apollo/client';
import useCustomFields from '@/hooks/useCustomFields';
import { CreateCustomFieldModal } from './CreateCustomFieldModal';
import { useObjectTypeNameMap } from '@/utils/customFields.helper';
import { SortableSettingsTable } from '@/stadiumDS/applicationComponents/SettingsTable/SortableSettingsTable';
import { customFieldsTableColumns } from './CustomFieldsTable.columns';
import { useCallback, useEffect, useRef, useState } from 'react';

// Stable empty array to avoid recreating on every render
const EMPTY_ARRAY: CustomField[] = [];
import useStore from '@/state';

interface CustomFieldsTableProps {
    objectType: CustomField['object_type'];
    defaultCustomFields?: CustomField[];
    limitValueTypes?: ValueType[];
}

export const CustomFieldsTable = ({
    objectType,
    defaultCustomFields = EMPTY_ARRAY,
    limitValueTypes,
}: CustomFieldsTableProps) => {
    const organization = useStore((state) => state.organization);

    const [deleteCustomField] = useMutation(customFieldDelete);
    const [updateOrder] = useMutation(customFieldsUpdateOrder);

    const { customFields, customFieldsRefetch, customFieldsLoading } =
        useCustomFields({
            objectType,
        });

    // Local state for drag-and-drop ordering
    const [orderedFields, setOrderedFields] = useState<CustomField[]>([]);
    // Use ref to avoid stale closure in handleDragEnd
    const orderedFieldsRef = useRef<CustomField[]>([]);
    // Track if we're currently dragging to prevent useEffect from resetting order
    const isDraggingRef = useRef(false);

    useEffect(() => {
        // Don't reset order during drag operations
        if (isDraggingRef.current) {
            return;
        }

        const fields = [...defaultCustomFields, ...customFields];

        setOrderedFields(fields);
        // Keep ref in sync
        orderedFieldsRef.current = fields;
    }, [customFields, defaultCustomFields]);

    const handleDeleteCustomField = (id: string) => {
        deleteCustomField({
            variables: {
                id,
            },
        }).then(() => {
            customFieldsRefetch();
        });
    };

    const handleDragStart = useCallback(() => {
        isDraggingRef.current = true;
    }, []);

    const handleReorder = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            setOrderedFields((prevFields) => {
                const newFields = [...prevFields];
                const [draggedField] = newFields.splice(dragIndex, 1);
                newFields.splice(hoverIndex, 0, draggedField);
                // Keep ref in sync
                orderedFieldsRef.current = newFields;
                return newFields;
            });
        },
        []
    );

    const handleDragEnd = useCallback(() => {
        isDraggingRef.current = false;

        // Use ref to get the latest ordered fields
        const currentFields = orderedFieldsRef.current;

        // Update order in the database
        // Filter out default fields but use their actual position in the full array for order values
        const fieldsToUpdate = currentFields
            .filter((f) => !defaultCustomFields.some((df) => df.id === f.id))
            .map((field) => {
                const actualIndex = currentFields.findIndex(
                    (f) => f.id === field.id
                );
                return {
                    id: field.id,
                    order: actualIndex,
                };
            });

        if (organization?.id && fieldsToUpdate.length > 0) {
            updateOrder({
                variables: {
                    organization_id: organization.id,
                    fields: fieldsToUpdate,
                },
            })
                .then(() => {
                    customFieldsRefetch();
                })
                .catch((error) => {
                    console.error(
                        'Failed to update custom field order:',
                        error
                    );
                });
        }
    }, [
        defaultCustomFields,
        updateOrder,
        customFieldsRefetch,
        organization?.id,
    ]);

    const existingKeys = orderedFields.map((field) => field.key);

    const objectTypeNameMap = useObjectTypeNameMap({ objectType });

    const tableColumns = customFieldsTableColumns({
        handleDeleteCustomField,
        refetchCustomFields: customFieldsRefetch,
        objectType,
        limitValueTypes,
    });

    const headerConfig = {
        title: objectTypeNameMap?.plural || objectType,
        subTitle:
            'Fields allow you to collect unique data from your ' +
            (objectTypeNameMap?.plural?.toLowerCase() || objectType),
        extraContent: (
            <CreateCustomFieldModal
                objectType={objectType}
                refetchCustomFields={customFieldsRefetch}
                existingKeys={existingKeys}
                limitValueTypes={limitValueTypes}
            />
        ),
    };

    const emptyStateConfig = {
        button: (
            <CreateCustomFieldModal
                objectType={objectType}
                refetchCustomFields={customFieldsRefetch}
                existingKeys={existingKeys}
                limitValueTypes={limitValueTypes}
            />
        ),
        title: 'No fields',
        description: `Add fields to ${
            objectTypeNameMap?.plural?.toLowerCase() || objectType
        }`,
    };

    // Use sortable table when ordering is enabled
    // Note: DndProvider is already provided at the App level, so we don't need to wrap here

    return (
        <SortableSettingsTable
            header={headerConfig}
            table={{
                columns: tableColumns,
                data: orderedFields,
                loading: customFieldsLoading,
                onReorder: handleReorder,
                onDragEnd: handleDragEnd,
                onDragStart: handleDragStart,
            }}
            emptyState={emptyStateConfig}
        />
    );
};
