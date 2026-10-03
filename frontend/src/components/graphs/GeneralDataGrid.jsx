import {
    useMemo, useEffect, useState, useRef, useContext, createContext
} from 'react';
import {
    DataGrid, Toolbar, ToolbarButton, gridEditRowsStateSelector, GridRowEditStopReasons,
    useGridSelector, useGridApiContext, GridActionsCell, GridActionsCellItem
} from '@mui/x-data-grid';
import {
    Grid, Alert, Box, Typography, TextField, InputLabel, FormControl, Button, Select,
    MenuItem, Tooltip
} from '@mui/material';
import apiClient from '../../api/client.js';
import { Search } from '@mui/icons-material';
import DataGridToolbar from '../layout/DataGridToolbar.jsx';
import { red } from '@mui/material/colors';

const ActionHandlersContext = createContext({
    handleCancelClick: () => { },
    handleDeleteClick: () => { },
    handleEditClick: () => { },
    handleSaveClick: () => { },
});

function ActionsCell(props) {
    const apiRef = useGridApiContext();
    const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);
    const isInEditMode = typeof rowModesModel[props.id] !== 'undefined';

    const { handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick } =
        useContext(ActionHandlersContext);

    return (
        <GridActionsCell {...props}>
            {isInEditMode ? (
                <>
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        material={{ sx: { color: 'primary.main' } }}
                        onClick={() => handleSaveClick(props.id)}
                    />
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={() => handleCancelClick(props.id)}
                        color="inherit"
                    />
                </>
            ) : (
                <>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => handleEditClick(props.id)}
                        color="inherit"
                    />
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteClick(props.id)}
                        color="inherit"
                    />
                </>
            )}
        </GridActionsCell>
    );
}

// NOTE: columns must be formatted as per the columns field in the @mui/x-data-grid 
// documentation
// NOTE: also, controls should be an array of objects with the following structure:
//  controls: { 
//      size: <number>, 
//      type: <"select" | "filter">, 
//      label: <string>
//      paramName: <string>
//      defaultValue?: <Any> (purely optional)
//      options?: <array of options> // (Only required when type == 'select')
//      min_value?: <number>
//      max_value?: <number>
//  }
function GeneralDataGrid({ endpoint, title, id = 'id', columns, hasActions = false, controls = undefined }) {
    if (typeof endpoint !== 'string') {
        throw new Error("\'endpoint\' parameter must be a string");
    }
    if (typeof title !== 'string') {
        throw new Error("\'title\' parameter must be a string");
    }
    if (controls !== undefined && typeof controls !== 'object') {
        throw new Error("\'controls\' must be an object");
    }
    if (typeof columns !== 'object') {
        throw new Error("\'columns\' must be formatted to @mui/x-data-grid standards.");
    }
    if (typeof hasActions !== 'boolean') {
        throw new Error("optional property \'hasActions\' must be a boolean");
    }
    let columnsContainsID = columns?.find(c => c.field === id) ? true : false;
    if (typeof id !== 'string' || !columnsContainsID) {
        throw new Error("\'id\' must be a string matching a column.id in columns.");
    }
    validateControls(controls);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filterModel, setFilterModel] = useState({ items: [] })
    const onRemoveFilter = (filterId) => {
        setFilterModel({
            items: filterModel.items.filter((item) => item.id !== filterId),
        });
    };

    if (hasActions === true) {
        // TODO: add a actions column to the datagrid GridColDef
        for (colDef of columns) {
            console.log(colDef);
        }
    }
    const actionHandlers = useMemo(
        () => ({
            handleEditClick: (id) => {
                // setRowModesModel((prevRowModesModel) => ({
                //     ...prevRowModesModel,
                //     [id]: { mode: GridRowModes.Edit },
                // }));
            },
            handleSaveClick: (id) => {
                // setRowModesModel((prevRowModesModel) => ({
                //     ...prevRowModesModel,
                //     [id]: { mode: GridRowModes.View },
                // }));
            },
            handleDeleteClick: (id) => {
                // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            },
            handleCancelClick: (id) => {
                // setRowModesModel((prevRowModesModel) => {
                //     return {
                //         ...prevRowModesModel,
                //         [id]: { mode: GridRowModes.View, ignoreModifications: true },
                //     };
                // });
                //
                // setRows((prevRows) => {
                //     const editedRow = prevRows.find((row) => row.id === id);
                //     if (editedRow.isNew) {
                //         return prevRows.filter((row) => row.id !== id);
                //     }
                //     return prevRows;
                // });
            },
        }),
        [],
    );

    let defVal = null;
    if (controls) {
        if (controls.type === 'select')
            defVal = controls.defaultValue ?? controls.options[0];
        else if (controls.type === 'filter')
            defVal = controls.defaultValue ?? 0;
        else if (typeof controls.paramName === 'string' &&
            controls.defaultValue != undefined) {

            defVal = controls.defaultValue;
        }
    }
    const [controlValue, setControlValue] = useState(defVal);
    const selectPartial = (size, label, OPTIONS) => {
        if (!OPTIONS && !OPTIONS?.length) {
            throw new Error("\'controls.options\' field must be a non-empty iterable object");
        }
        if (!label && typeof label !== 'string') {
            throw new Error("\'controls.label\' field must be a non-empty string");
        }
        return (
            <Grid size={size}>
                <FormControl size='small' sx={{ minWidth: 100 }}>
                    <InputLabel id={`${controls?.label}-filter-label`} sx={{ justifyContent: 'center' }}>
                        {label}
                    </InputLabel>
                    <Select
                        labelId={`${label.toLowerCase()}-filter-label`}
                        label={label}
                        value={controlValue}
                        onChange={(event) => setControlValue(event.target.value)}
                    >
                        {OPTIONS.map((option) => (
                            <MenuItem key={option || 'All'} value={option}>
                                {option === '' ? 'All' : option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl >
            </Grid >
        );
    }
    let htmlInput = {};
    if (controls?.min_value != undefined) htmlInput["min"] = controls.min_value;
    if (controls?.max_value != undefined) htmlInput["max"] = controls.max_value;
    const inputRef = useRef(null);
    const filterTextField = (size, label) => {
        if (!label && typeof label !== 'string') {
            throw new Error("\'controls.label\' field must be a non-empty string");
        }
        if (size < 1) {
            throw new Error("\'controls.size\' must be >= 1");
        }
        return (
            <>
                <Grid size={size - 1}>
                    <TextField
                        label={label}
                        slotProps={{
                            htmlInput: htmlInput
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                            },
                            alignContent: 'center',
                            display: 'flex'
                        }}
                        type="number"
                        inputRef={inputRef}
                        defaultValue={defVal}
                    />
                </Grid>
                <Grid size={1}>
                    <Button startIcon={<Search />} size='large' variant='outlined' onClick={() => setControlValue(inputRef?.current.value)} sx={{ height: 40, ml: 0 }}>Lookup</Button>
                </Grid>
            </>
        );
    }

    async function fetchData() {
        try {
            let response;
            if (controlValue != undefined) {
                response = await apiClient.get(endpoint,
                    { params: { [controls.paramName]: controlValue } }
                );
            }
            else {
                response = await apiClient.get(endpoint);
            }
            setData(response.data);
        } catch (error) {
            console.error(error);
            setError(`Could not load metric data. (${title})`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setError(null);
        setLoading(false);
        fetchData();
        return () => { };
    }, [controlValue])

    // TODO: Now I need to add a dict to the component params to add the textbox search
    // and priority dropdown 
    let sizeOffset = controls?.size ?? 0;
    return (
        <>
            <Box sx={{ mt: 2, mb: 8, height: 420, width: '100%' }} >
                <Grid container spacing={2}>
                    {controls?.type === 'select' && selectPartial(controls?.size, controls?.label, controls?.options)}
                    {controls?.type === 'filter' && filterTextField(controls?.size, controls?.label)}
                    {sizeOffset * 2 > 12 && (
                        <Grid size={12 - sizeOffset}><span /></Grid>
                    )}
                    <Grid size={sizeOffset * 2 > 12 ? 12 : 12 - sizeOffset * 2}>
                        <Typography
                            sx={{
                                width: '100%',
                                justifyContent: 'center',
                                alignContent: 'center',
                                color: red[400]
                            }}
                            variant="h6"
                            component="span"
                        >
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
                {/*loading && !error && <CircularProgress />*/}
                {error && <Alert severity="error">{error}</Alert>}
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row[id]}
                    filterModel={filterModel}
                    onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                    loading={loading}
                    slots={{
                        toolbar: DataGridToolbar,
                    }}
                    slotProps={{
                        toolbar: { onRefresh: fetchData, onRemoveFilter: onRemoveFilter }
                    }}
                    showToolbar
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                />
            </Box >
        </>
    );
}

const validateControls = (controls) => {
    if (controls) {
        if (!controls.paramName || typeof controls.paramName !== 'string') {
            throw new Error("\'controls.paramName\' must be defined as a string");
        }
        if (controls.type) {
            if (typeof controls.type !== 'string') {
                throw new Error("\'controls.type\' must be defined as a string and match either \'select\' or \'filter\'");
            }
            if (controls.type === 'select') {
                if (!controls.label) {
                    throw new Error("\'controls.label\' must be defined as a string");
                }
                if (!controls.size > 0 || typeof controls.size !== 'number')
                    throw new Error("\'controls.size\' must be defined as a number and be greater than 0 for type \'select\'.");
                if (!controls.options || !controls.options?.length)
                    throw new Error("\'controls.options\' must be defined as an Array prototype for type \'select\'");
            } else if (controls.type === 'filter') {
                if (!controls.label) {
                    throw new Error("\'controls.label\' must be defined as a string");
                }
                if (!controls.size > 1)
                    throw new Error("\'controls.size\' must be defined and be greater than 1 for type \'filter\'.");
                if (controls.min_value != undefined && typeof controls.min_value !== 'number') {
                    throw new Error("optional parameter \'controls.min_value\' must be a number");
                } if (controls.max_value != undefined && typeof controls.max_value !== 'number') {
                    throw new Error("optional parameter \'controls.min_value\' must be a number");
                }
            } else {
                throw new Error(`Invalid \'controls.type\': \"${controls?.type}\"`);
            }
        }
    }
}

export default GeneralDataGrid;
