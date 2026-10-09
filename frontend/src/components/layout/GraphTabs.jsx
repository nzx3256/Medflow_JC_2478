import { useState } from 'react';
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { Tab } from '@mui/material'
import { red } from '@mui/material/colors';

function GraphTabs({ tabDict, startingValue = undefined }) {
    let entries = [];
    let contents;
    if (typeof tabDict == 'object') {
        entries = Object.entries(tabDict);
    } else { throw new TypeError("tabDict must be a JSON formatted object"); }
    if (startingValue == undefined || !tabDict.hasOwnProperty(startingValue)) {
        if (entries.length) {
            [startingValue, contents] = entries[0];
        } else { startingValue = null; }
    }
    const [value, setValue] = useState(startingValue);

    return (
        <TabContext value={value}>
            <TabList
                onChange={(_, newValue) => setValue(newValue)}
                aria-label="DataGrids"
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    "& .MuiTabs-indicator": {
                        backgroundColor: "primary.light",
                    },
                }}
            >
                {entries.map(([label, _]) => {
                    return (
                        <Tab
                            key={label}
                            label={label}
                            value={label}
                            sx={{
                                color: "#777",
                                "&.Mui-selected": {
                                    color: "primary.main",
                                },
                            }}
                        />
                    );
                })}
            </TabList >
            {entries.map(([label, panel]) => {
                return (
                    <TabPanel key={label} value={label}>
                        {panel}
                    </TabPanel>
                );
            })}
        </TabContext>
    );
}

export default GraphTabs;
