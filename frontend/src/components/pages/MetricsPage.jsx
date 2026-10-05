import { Typography } from "@mui/material";
import MaintenanceFlagsDataGrid from '../graphs/MaintenanceFlagsDataGrid.jsx';
import DiscrepancyDataGrid from "../graphs/DiscrepancyDataGrid.jsx";
import LowChargeDataGrid from '../graphs/LowChargeDataGrid.jsx';
import ReliabilityMetricsDataGrid from "../graphs/ReliabilityMetricsDataGrid.jsx";
import ReportingLinesDataGrid from "../graphs/ReportingLinesDataGrid.jsx";

function MetricsPage() {

    return (
        <>
            <DiscrepancyDataGrid />
            <MaintenanceFlagsDataGrid />
            <LowChargeDataGrid />
            <ReliabilityMetricsDataGrid />
            <ReportingLinesDataGrid />
        </>
    )
}

export default MetricsPage;
