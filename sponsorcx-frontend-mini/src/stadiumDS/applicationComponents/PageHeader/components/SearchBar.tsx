import colors from '@/stadiumDS/foundations/colors';
import Search from '@/stadiumDS/foundations/icons/General/Search';
import X from '@/stadiumDS/foundations/icons/General/X';
import { ActionIcon, TextInput } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

interface SearchBarProps {
    defaultToOpen?: boolean;
    /** Custom key for the search query param. Defaults to 'search'. */
    searchKey?: string;
}

export const SearchBar = ({
    defaultToOpen = false,
    searchKey = 'search',
}: SearchBarProps) => {
    // Dynamically create query params config based on searchKey
    const queryParamsConfig = useMemo(
        () => ({ [searchKey]: StringParam }),
        [searchKey]
    );
    const [queryParams, setQueryParams] = useQueryParams(queryParamsConfig);

    // Helper to get/set the search value regardless of key
    const searchValue = queryParams[searchKey];

    const [searchBarActive, setSearchBarActive] = useState(defaultToOpen);
    const inputRef = useRef<HTMLInputElement>(null);
    const isClickingActionIconRef = useRef(false);
    const [firstFocus, setFirstFocus] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // listen for cmd + k
            if (e.metaKey && e.key === 'k') {
                e.preventDefault();
                setSearchBarActive(true);
                inputRef.current?.focus();
            }
            // listen for esc
            if (e.key === 'Escape') {
                setSearchBarActive(defaultToOpen);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [defaultToOpen]);

    return (
        <TextInput
            ref={inputRef}
            autoFocus={!defaultToOpen && firstFocus}
            placeholder={searchBarActive ? 'Search' : ''}
            onChange={(e) => {
                if (e.target.value === '') {
                    setQueryParams({ [searchKey]: undefined }, 'replaceIn');
                } else {
                    setQueryParams(
                        { [searchKey]: e.target.value },
                        'replaceIn'
                    );
                }
            }}
            onFocus={() => setFirstFocus(true)}
            onBlur={
                searchValue
                    ? undefined
                    : () => {
                          if (!isClickingActionIconRef.current) {
                              setSearchBarActive(defaultToOpen);
                          }
                      }
            }
            defaultValue={searchValue || ''}
            leftSection={
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    onMouseDown={() => {
                        isClickingActionIconRef.current = true;
                    }}
                    onClick={() => {
                        isClickingActionIconRef.current = false;
                        if (searchBarActive) {
                            setSearchBarActive(false);
                            inputRef.current?.blur();
                        } else {
                            setSearchBarActive(true);
                            inputRef.current?.focus();
                        }
                    }}
                    style={{
                        borderRadius: '6px',
                    }}
                >
                    <Search color={colors.Gray[400]} size="18" variant="md" />
                </ActionIcon>
            }
            rightSection={
                searchBarActive && (
                    <ActionIcon
                        variant="subtle"
                        onClick={() => {
                            setQueryParams({ [searchKey]: undefined });
                            if (inputRef.current) {
                                inputRef.current.value = '';
                            }
                        }}
                    >
                        <X color={colors.Gray[400]} size="18" />
                    </ActionIcon>
                )
            }
            styles={{
                input: {
                    padding: `2px ${searchBarActive ? '32px' : '0px'} 2px 32px`,
                    border: searchBarActive
                        ? `1px solid ${colors.Gray[300]}`
                        : `0px solid ${colors.Gray[300]}`,
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: searchBarActive
                        ? `0px 1px 2px 0px rgba(10, 13, 18, 0.05)`
                        : 'none',
                    height: '32px',
                    fontSize: '12px',
                },
                root: {
                    width: searchBarActive ? '188px' : '32px',
                    transition: 'width 0.3s ease-in-out',
                },
            }}
        />
    );
};
