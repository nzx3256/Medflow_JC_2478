import { useMemo, useState } from 'react';
import { Chip, IconButton, Stack, Tooltip, Typography, Badge } from '@mui/material';
import {
    useGridApiContext, useGridSelector, gridFilterActiveItemsSelector,
    gridColumnLookupSelector, GridFilterListIcon, Toolbar, FilterPanelTrigger,
    ToolbarButton, GridRowModes
} from '@mui/x-data-grid';

import { useAuth } from '../../context/AuthContext.jsx';

import capitalize from '@mui/utils/capitalize';

import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

function DataGridToolbar({ onRefresh, onRemoveFilter, onAddRow }) {
    const apiRef = useGridApiContext();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const columns = useGridSelector(apiRef, gridColumnLookupSelector);
    const [seq, setSeq] = useState(0);
    const { user } = useAuth();

    //const newRow = ;
    const handleClick = () => {
        if (typeof onAddRow === 'function') onAddRow();
        // const id = `Edit ${seq}`;
        // setSeq((prev) => prev + 1);
        // setRows((oldRows) => [
        //     { id, isNew: true },
        //     ...oldRows,
        // ]);
        // setRowModesModel((oldModel) => ({
        //     ...oldModel,
        //     [id]: { mode: GridRowModes.Edit },
        // }));
    };
    return (
        <Toolbar>
            {user?.role === "Clinical Admin" && <Tooltip title="Add record">
                <ToolbarButton onClick={handleClick}>
                    <AddIcon />
                </ToolbarButton>
            </Tooltip>}
            <Tooltip title='Refresh'>
                <IconButton
                    children={<RefreshIcon />}
                    onClick={onRefresh}
                />
            </Tooltip>
            <Tooltip title="Filters">
                <FilterPanelTrigger render={<ToolbarButton />}>
                    <Badge
                        badgeContent={activeFilters.length}
                        variant='dot'
                        color="error"
                    >
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
