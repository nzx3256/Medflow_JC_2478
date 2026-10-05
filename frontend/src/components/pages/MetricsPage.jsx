import { Typography } from "@mui/material";
import MaintenanceFlagsDataGrid from '../graphs/MaintenanceFlagsDataGrid.jsx';
import DiscrepancyDataGrid from "../graphs/DiscrepancyDataGrid.jsx";
import LowChargeDataGrid from '../graphs/LowChargeDataGrid.jsx';

function MetricsPage() {

    return (
        <>
            <DiscrepancyDataGrid />
            <MaintenanceFlagsDataGrid />
            <LowChargeDataGrid />
        </>
    )
}

export default MetricsPage;
