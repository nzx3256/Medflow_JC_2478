import {
    useMemo, useEffect, useState, useRef, useContext, createContext
} from 'react';
import {
    DataGrid, Toolbar, ToolbarButton, gridEditRowsStateSelector,
    GridRowEditStopReasons, useGridSelector, useGridApiContext, GridActionsCell,
    GridActionsCellItem, GridRowModes,

} from '@mui/x-data-grid';
import {
    Grid, Alert, Box, Typography, TextField, InputLabel, FormControl, Button, Select,
    MenuItem, Tooltip,
} from '@mui/material';
import apiClient from '../../api/client.js';
import { Search } from '@mui/icons-material';
import DataGridToolbar from '../layout/DataGridToolbar.jsx';
import { red } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

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
                        material={{ sx: { color: '#2196f3' } }}
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
                        icon={<DeleteIcon sx={{ color: 'red' }} />}
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
function GeneralDataGrid({ endpoint, title, id = 'id', columns, fullCRUD = false, controls = undefined }) {
    if (typeof endpoint !== 'string') {
        throw new Error("\'endpoint\' parameter defined must be a string");
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
    if (typeof fullCRUD !== 'boolean') {
        throw new Error("optional property \'fullCRUD\' must be a boolean");
    }
    let columnsContainsID = columns?.find(c => c.field === id) ? true : false;
    if (typeof id !== 'string' || !columnsContainsID) {
        throw new Error("\'id\' must be a string matching a column.id in columns.");
    }
    validateControls(controls);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rowModesModel, setRowModesModel] = useState({});

    const [filterModel, setFilterModel] = useState({ items: [] })
    const onRemoveFilter = (filterId) => {
        setFilterModel({
            items: filterModel.items.filter((item) => item.id !== filterId),
        });
    };

    // build an empty row matching current columns (exclude actions column)
    const makeEmptyRow = (newId) => {
        const emptyValues = {};
        internalColDef.forEach(col => {
            if (col.field === 'actions' || col.field === id) return;
            emptyValues[col.field] = col.value ?? '';
        });
        return { ...emptyValues, [id]: newId, isNew: true };
    };

    const handleAddRow = () => {
        // unique id for new row — use timestamp + counter to avoid collisions
        const newId = `Edit-${Date.now()}`;
        const newRow = makeEmptyRow(newId);

        setData((prevRows) => [newRow, ...prevRows]);
        setRowModesModel((prev) => ({
            ...prev,
            [newId]: { mode: GridRowModes.Edit },
        }));
    };

    const processRowUpdate = async (newRow, oldRow, param) => {
        let updatedRow = undefined;
        const rowId = param["rowId"];
        try {
            if (newRow?.isNew) {
                const resourceUrl = `${endpoint}`;
                let clonedRow = structuredClone(newRow);
                delete clonedRow.id;
                const response = await apiClient.post(resourceUrl, clonedRow);
                updatedRow = { ...response.data, isNew: false };
                if (typeof rowId === 'string') {
                    setData((prevRows) => [...prevRows.filter((row) => row.id !== rowId), updatedRow]);
                }
            }
            else {
                const resourceUrl = `${endpoint}/${rowId}`;
                const response = await apiClient.patch(resourceUrl, newRow);
                updatedRow = { ...response.data, isNew: false };
            }
            if (typeof rowId === 'string') {
                setData((prevRows) => prevRows.filter((row) => row.id !== rowId));
            }
            setData((prevRows) =>
                prevRows.map((r) => (r[id] === newRow[id] ? updatedRow : r))
            );
            return { ...updatedRow };
        }
        catch (err) {
            // Have a snack bar pop up
            console.error("Update failed:", err);
        }
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const internalColDef = useMemo(() => {
        let foundActions = false;
        const result = columns.map((colDef) => {
            if (colDef.field === 'actions') {
                foundActions = true;
            }
            return colDef;
        });
        if (fullCRUD === true && !foundActions) {
            // TODO: add an actions column to the datagrid GridColDef
            result.push({
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 100,
                cellClassName: 'actions',
                minWidth: 100,
                renderCell: (params) => <ActionsCell {...params} />,
            });
        }
        return result;
    }, [columns, fullCRUD]);

    async function deleteRow(id) {
        const resourceUrl = `${endpoint}/${id}`;
        try {
            await apiClient.delete(resourceUrl);
            fetchData();
        }
        catch (err) {
            //console.error("Delete failed:", err);
            //setError(err.response?.data?.detail || "Delete failed");
            //Have a snackbar popup with an error
        }
    }
    const actionHandlers = useMemo(
        () => ({
            handleEditClick: (id) => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.Edit },
                }));
            },
            handleSaveClick: (id) => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.View },
                }));
            },
            handleDeleteClick: (id) => {
                if (typeof id === 'string') {
                    setData((prevRows) => prevRows.filter((row) => row.id !== id));
                }
                else if (typeof id === 'number') {
                    deleteRow(id);
                }
                //setData((prevRows) => prevRows.filter((row) => row.id !== id));
            },
            handleCancelClick: (id) => {
                setRowModesModel((prevRowModesModel) => {
                    return {
                        ...prevRowModesModel,
                        [id]: { mode: GridRowModes.View, ignoreModifications: true },
                    };
                });

                setData((prevRows) => {
                    const editedRow = prevRows.find((row) => row.id === id);
                    if (editedRow == undefined) {
                        return prevRows;
                    }
                    //console.log(JSON.stringify(editedRow));
                    if (editedRow.isNew) {
                        return prevRows.filter((row) => row.id !== id);
                    }
                    return prevRows;
                });
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
                    <InputLabel id={`${controls?.label}-filter-label`} sx={{ justifyContent: 'center', color: '#777' }}>
                        {label}
                    </InputLabel>
                    <Select
                        labelId={`${label.toLowerCase()}-filter-label`}
                        label={label}
                        value={controlValue}
                        onChange={(event) => setControlValue(event.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#777',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderRadius: 1
                            },
                            '&.Mui-focused .MuiSelect-select': {
                                color: 'primary.main',
                            },
                            '& .MuiSelect-select': {
                                color: '#777',
                            },

                        }}
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
                            display: 'flex',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#777' },           // default
                                '&:hover fieldset': { borderColor: '#999' },// hover
                                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderRadius: 1 }, // focused
                            },
                            // label color
                            '& .MuiInputLabel-root': {
                                color: 'gray',
                                '&.Mui-focused': { color: 'primary.main' },
                            },
                            // input (text) color and placeholder
                            '& .Mui-focused .MuiInputBase-input': {
                                color: 'primary.main',                                  // text color
                                opacity: 1,
                            },
                            '& .MuiInputBase-input': {
                                color: '#aaa',                                  // text color
                                '&::placeholder': { color: '#999', opacity: 1 },
                            },
                        }}
                        type="number"
                        inputRef={inputRef}
                        defaultValue={defVal}
                    />
                </Grid>
                <Grid size={1}>
                    <Button
                        startIcon={<Search />}
                        size='large'
                        variant='outlined'
                        onClick={() => setControlValue(inputRef?.current.value ?? defVal)}
                        sx={{ height: 40, ml: 0 }}
                    > Lookup </Button>
                </Grid>
            </>
        );
    }

    async function fetchData() {
        try {
            let response;
            if (controlValue != undefined && controlValue !== "") {
                response = await apiClient.get(endpoint,
                    { params: { [controls.paramName]: controlValue ?? undefined } }
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
            <Box sx={{
                mt: 2, mb: 8, height: 420,
                //display: 'inline-block', 
                //minWidth: { sm: 600, md: 900, lg: 500, xl: 680 },
                //maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '47%' }
            }} >
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
                                color: 'primary.main'
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
                <ActionHandlersContext.Provider value={actionHandlers}>
                    {!error && <DataGrid
                        rows={data}
                        columns={internalColDef}
                        getRowId={(row) => row[id]}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={setRowModesModel}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        filterModel={filterModel}
                        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                        loading={loading}
                        showToolbar
                        slots={{
                            toolbar: DataGridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                onRefresh: fetchData,
                                onRemoveFilter: onRemoveFilter,
                                onAddRow: handleAddRow,
                                hasAddAction: fullCRUD
                            }
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 20, 50, { value: -1, label: 'All' }]}
                        sx={{ '& textarea': { color: 'text.primary' } }}
                    />}
                </ActionHandlersContext.Provider>
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
