import { Avatar, Card, Chip, Typography } from "@mui/material";

const stringToColor = (str) => {
    if (str == undefined) return '#000';
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let color = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += value.toString(16).padStart(2, '0')
    }
    return color
};

function UserCard({ entry }) {
    let chipColor = 'black';
    switch (entry?.['role']) {
        case "Clinical Admin":
            chipColor = 'red';
            break;
        case "Field Technician":
            chipColor = 'green';
            break;
        case "Auditor":
            chipColor = 'blue';
            break;
    }
    return (
        <Card sx={{ flex: 1 }}>
            <div>
                <Avatar sx={{
                    backgroundColor: stringToColor(entry?.username),
                    color: 'white'
                }}>{entry?.username?.[0]?.toUpperCase()}</Avatar>
                <Typography
                    children={entry?.username}
                    component='span'
                    variant='h5'
                />
            </div>
            <Typography children={`id: ${entry?.id}`} />
            <Chip
                label={entry?.role}
                variant='outlined'
                sx={{
                    backgroundColor: 'text.background',
                    borderColor: chipColor,
                    borderWidth: 2, width: '95%'
                }}
            />
        </Card>
    );
}

export default UserCard;
