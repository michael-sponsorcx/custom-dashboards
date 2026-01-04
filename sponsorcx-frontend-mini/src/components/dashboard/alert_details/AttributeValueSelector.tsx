import { Stack, Text, Select, MultiSelect } from '@mantine/core';
import { useState } from 'react';

// TODO: Replace with actual data from the graph's cube view
const MOCK_ATTRIBUTES = [
  { value: 'account_name', label: 'Account Name' },
  { value: 'product_category', label: 'Product Category' },
  { value: 'region', label: 'Region' },
  { value: 'sales_rep', label: 'Sales Rep' },
  { value: 'customer_segment', label: 'Customer Segment' },
];

// TODO: Replace with actual values based on selected attribute
const MOCK_ATTRIBUTE_VALUES = [
  { value: 'acme_corp', label: 'Acme Corp' },
  { value: 'globex_inc', label: 'Globex Inc' },
  { value: 'initech', label: 'Initech' },
  { value: 'umbrella_corp', label: 'Umbrella Corp' },
  { value: 'wayne_enterprises', label: 'Wayne Enterprises' },
];

/**
 * AttributeValueSelector Component
 *
 * Reusable component for selecting a dimension/attribute and its values.
 * Used in both AttributeThresholdAlertDetails and AttributeScheduledAlertDetails.
 *
 * Fields:
 * - Select Attribute: Dropdown to select a dimension/attribute from the graph's cube view
 * - Select Values: Multi-select to choose specific values of the selected attribute
 */
export const AttributeValueSelector = () => {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <>
      {/* Attribute Selection */}
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Select Attribute
        </Text>
        <Select
          placeholder="Search and select an attribute"
          data={MOCK_ATTRIBUTES}
          value={selectedAttribute}
          onChange={setSelectedAttribute}
          searchable
        />
      </Stack>

      {/* Values Selection - Only show if attribute is selected */}
      {selectedAttribute && (
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Select Values
          </Text>
          <MultiSelect
            placeholder="Select one or more values"
            data={MOCK_ATTRIBUTE_VALUES}
            value={selectedValues}
            onChange={setSelectedValues}
            searchable
          />
        </Stack>
      )}
    </>
  );
};
