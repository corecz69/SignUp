import {Avatar, Button, Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";

interface Props {
    id: string;
    name: string;
    email: string;
    classname?: string;
}

export function UserCard({id, name, email, classname}: Props){
    return (
        <Card sx={{
            minWidth: 200,
            gap: 2,
            mb: 2
        }}>
            <CardContent>
                <Stack spacing={2} alignItems="center">
                    <Avatar>
                        <AccountCircle sx={{fontSize: 60}}/>
                    </Avatar>
                    <Typography variant="subtitle1">{name}</Typography>
                    <Typography variant="body2">{email}</Typography>
                    <Typography variant="body2">{classname}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                {/* TODO routing */}
                <Button size="small"
                        onClick={() => console.log("jde se na detail osoby s id: " + id)}
                >Detail</Button>
            </CardActions>
        </Card>
    )
}