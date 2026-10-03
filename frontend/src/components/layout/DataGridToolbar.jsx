import { useState } from 'react';
import { Chip, IconButton, Stack, Tooltip, Typography, Badge } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    useGridApiContext, useGridSelector, gridFilterActiveItemsSelector, gridColumnLookupSelector, GridFilterListIcon, Toolbar, FilterPanelTrigger, ToolbarButton
} from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import capitalize from '@mui/utils/capitalize';

function DataGridToolbar({ onRefresh, onRemoveFilter }) {
    const apiRef = useGridApiContext();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const columns = useGridSelector(apiRef, gridColumnLookupSelector);

    return (
        <Toolbar>
            <Tooltip title='Refresh'>
                <IconButton
                    children={<RefreshIcon />}
                    onClick={onRefresh}
                />
            </Tooltip>
            <Tooltip title="Filters">
                <FilterPanelTrigger render={<ToolbarButton />}>
                    <Badge badgeContent={activeFilters.length} color='secondary' variant='dot'>
                        <GridFilterListIcon fontSize="small" />
                    </Badge>
                </FilterPanelTrigger>
            </Tooltip>
            <Stack direction="row" sx={{ gap: 0.5, flex: 1 }}>
                {activeFilters.map((filter) => {
                    const column = columns[filter.field];
                    const field = column?.headerName ?? filter.field;
                    const operator = apiRef.current.getLocaleText(
                        `filterOperator${capitalize(filter.operator)}`,
                    );
                    const isDate = column?.type === 'date';
                    const value = isDate
                        ? new Date(filter.value).toLocaleDateString()
                        : (filter.value ?? '');

                    return (
                        <Chip
                            key={filter.id}
                            label={`${field} ${operator} ${value}`}
                            onDelete={() => onRemoveFilter(filter.id)}
                            sx={{ mx: 0.25 }}
                        />
                    );
                })}
            </Stack>
        </Toolbar>
    );
}

export default DataGridToolbar;
