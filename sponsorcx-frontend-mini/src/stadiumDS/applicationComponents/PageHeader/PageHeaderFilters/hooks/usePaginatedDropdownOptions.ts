import { useEffect, useMemo, useRef, useState } from 'react';
import { DropdownItemProps } from 'semantic-ui-react';
import { DocumentNode } from 'graphql';
import { useLazyQuery } from '@apollo/client';
import useStore from '@/state';

interface UsePaginatedDropdownOptionsProps {
    options: DropdownItemProps[];
    selectedIds: string[];
    queryForMissingOptions: DocumentNode;
    queryNameForMissingOptions: string;
}

export const usePaginatedDropdownOptions = ({
    options,
    selectedIds,
    queryForMissingOptions,
    queryNameForMissingOptions,
}: UsePaginatedDropdownOptionsProps) => {
    const organization = useStore((state) => state.organization);

    const [allOptions, setAllOptions] = useState<DropdownItemProps[]>(options);

    const selectedOptions = useMemo(() => {
        const selectedIdsSet = new Set(selectedIds);
        return allOptions.filter((option) =>
            selectedIdsSet.has(option.value as string)
        );
    }, [allOptions, selectedIds]);

    useEffect(() => {
        const currentStoredIds = new Set(
            allOptions.map((option) => option.value as string)
        );
        const newOptions = options.filter(
            (option) => !currentStoredIds.has(option.value as string)
        );
        const newOptionsWithCurrent = [...allOptions, ...newOptions].sort(
            (a, b) => (a.text as string).localeCompare(b.text as string)
        );
        setAllOptions(newOptionsWithCurrent);
    }, [options]);

    const [getMissingOptions] = useLazyQuery(queryForMissingOptions);
    const missingOptionsFetchTriggered = useRef(false);
    useEffect(() => {
        const allIds = new Set(
            allOptions.map((option) => option.value as string)
        );
        const missingIds = selectedIds.filter((id) => !allIds.has(id));
        if (missingIds.length > 0) {
            if (missingOptionsFetchTriggered.current) return;
            missingOptionsFetchTriggered.current = true;
            getMissingOptions({
                variables: {
                    organization_id: organization.id,
                    ids: missingIds,
                },
                onCompleted: (data) => {
                    if (data[queryNameForMissingOptions]) {
                        setAllOptions((prev) => [
                            ...prev,
                            ...data[queryNameForMissingOptions],
                        ]);
                    }
                },
            });
        } else {
            missingOptionsFetchTriggered.current = false;
        }
    }, [allOptions, selectedIds, getMissingOptions, organization.id]);

    return {
        allOptions,
        selectedOptions,
    };
};
