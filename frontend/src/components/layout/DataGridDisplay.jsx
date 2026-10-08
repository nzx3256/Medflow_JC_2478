import { Grid } from "@mui/material";
import HospitalDataGrid from "../graphs/HospitalDataGrid.jsx";
import EquipmentDataGrid from "../graphs/EquipmentDataGrid.jsx";
import TechnicianDataGrid from "../graphs/TechnicianDataGrid.jsx";
import WorkOrderDataGrid from "../graphs/WorkOrderDataGrid.jsx";

function DataGridDisplay() {
    return (
        <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <HospitalDataGrid />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <EquipmentDataGrid />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <TechnicianDataGrid />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                <WorkOrderDataGrid />
            </Grid>
        </Grid >
    );
}

export default DataGridDisplay;
