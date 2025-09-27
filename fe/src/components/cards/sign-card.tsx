import {Button, Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography, Box} from "@mui/material";
import {PlayArrow, School, LocationOn} from "@mui/icons-material";

interface Props {
    id: string;
    translations: string[];
    explanation?: string;
    videoFileName: string;
    categoryName?: string;
    categoryId?: string;
    type?: string;
    languageLevel?: string;
    region?: string;
    // Legacy props for backward compatibility
    signId?: string;
    fileName?: string;
}

export function SignCard({
    id,
    translations,
    explanation,
    videoFileName,
    categoryName,
    categoryId,
    type,
    languageLevel,
    region,
    // Legacy support
    signId,
    fileName
}: Props) {
    // Support legacy props
    const actualId = id || signId || '';
    const actualFileName = videoFileName || fileName || '';
    const actualTranslations = translations || [];

    const getTypeColor = (signType?: string) => {
        switch (signType) {
            case 'BASIC': return 'primary';
            case 'COMPOUND': return 'secondary';
            case 'FINGERSPELLING': return 'warning';
            default: return 'default';
        }
    };

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'BEGINNER': return 'success';
            case 'INTERMEDIATE': return 'warning';
            case 'ADVANCED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
            }
        }}>
            <CardActionArea
                onClick={() => console.log("Přechod na detail znaku s ID: " + actualId)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Video Section */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="video"
                        src={actualFileName ? `/api/files/videos/${actualFileName}` : ''}
                        poster="/placeholder-video.jpg"
                        sx={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            backgroundColor: 'grey.100'
                        }}
                        onMouseEnter={(e) => e.currentTarget.play?.()}
                        onMouseLeave={(e) => {
                            e.currentTarget.pause?.();
                            e.currentTarget.currentTime = 0;
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderRadius: 1,
                        p: 0.5
                    }}>
                        <PlayArrow sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                </Box>

                {/* Content Section */}
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Category and Type Badges */}
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        {categoryName && (
                            <Chip
                                size="small"
                                label={categoryName}
                                variant="outlined"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    console.log("Přechod na kategorii s ID: " + categoryId);
                                }}
                            />
                        )}
                        {type && (
                            <Chip
                                size="small"
                                label={type}
                                color={getTypeColor(type) as any}
                                variant="filled"
                            />
                        )}
                    </Stack>

                    {/* Translations */}
                    <Box sx={{ mb: 1 }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {actualTranslations.slice(0, 3).map((translation, i) => (
                                <Chip
                                    key={i}
                                    label={translation}
                                    size="small"
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            ))}
                            {actualTranslations.length > 3 && (
                                <Chip
                                    label={`+${actualTranslations.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {/* Explanation */}
                    {explanation && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {explanation}
                        </Typography>
                    )}

                    {/* Footer Info */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                        <Stack direction="row" spacing={0.5}>
                            {languageLevel && (
                                <Chip
                                    size="small"
                                    label={languageLevel}
                                    color={getLevelColor(languageLevel) as any}
                                    variant="outlined"
                                    icon={<School />}
                                    sx={{ fontSize: '0.7rem' }}
                                />
                            )}
                            {region && (
                                <Chip
                                    size="small"
                                    label={region}
                                    variant="outlined"
                                    icon={<LocationOn />}
                                    sx={{ fontSize: '0.7rem' }}
                                />
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}