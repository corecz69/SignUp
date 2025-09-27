import {Button, Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
interface Props {
    id: string;
    name: string;
    categoryCount: number;
    studentCount: number;
}

export function SubjectCard({id, name, categoryCount, studentCount}: Props){
    {/* TODO přidat onClick, přesměrování na detail předmětu podle id. */}

    return (
        <Card sx={{
            minWidth: 200,
            gap: 2,
            mb: 2
        }}>
            <CardContent>
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h6"  >{name}</Typography>
                    <Typography variant="body2">Počet kategorií: {categoryCount}</Typography>
                    <Typography variant="body2">Počet studentů: {studentCount}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button size="small"
                        onClick={() => console.log("jde se na detail předmět s id: " + id)}
                >Detail</Button>
            </CardActions>
        </Card>
    )
}