import {Button, Card, CardActionArea, CardContent, CardMedia, Chip, Stack} from "@mui/material";

interface Props {
    signId: string;
    fileName: string;
    categoryId: string;
    categoryName: string;
    translations: string[];
}

export function SignCard({signId, fileName, categoryId, categoryName, translations}: Props) {

    return (
        <Card sx={{
            minWidth: 200,
            maxWidth: 350,
            gap: 2,
            mb: 2
        }}>
            {/* TODO routing */}
            <CardActionArea onClick={() => console.log("jdeme na znak s id: " + signId)}>
                <CardMedia
                    component="video"
                    src={fileName}
                    controls
                    sx={{
                        width: "100%",
                        aspectRatio: "16 / 9"
                    }}
                >
                </CardMedia>
                <CardContent>
                    <Stack>
                        <Button onClick={(event) => {
                            event.stopPropagation();
                            {/* TODO routing */}
                            console.log("jdeme na kategorii s id: " + categoryId);
                        }}>{categoryName}</Button>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap >
                            {translations.map((t, i) => (
                                <Chip key={i} label={t} size="small" />
                            ))}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>

        </Card>
    )
}