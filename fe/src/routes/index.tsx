import { createFileRoute, Link } from '@tanstack/react-router';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Stack,
    Chip,
    Paper
} from '@mui/material';
import {
    Search,
    VideoLibrary,
    School,
    Accessibility,
    PlayArrow,
    Category,
    TrendingUp
} from '@mui/icons-material';

export const Route = createFileRoute('/')({
    component: HomePage,
});

function HomePage() {
    const features = [
        {
            icon: <VideoLibrary sx={{ fontSize: 40 }} />,
            title: 'Videotéka znaků',
            description: 'Rozsáhlá kolekce videí znakového jazyka s českými překlady a vysvětleními'
        },
        {
            icon: <Search sx={{ fontSize: 40 }} />,
            title: 'Pokročilé vyhledávání',
            description: 'Vyhledávejte znaky podle překladů, kategorií nebo jednotlivých komponent pohybu'
        },
        {
            icon: <School sx={{ fontSize: 40 }} />,
            title: 'Vzdělávací nástroj',
            description: 'Určeno pro studenty a učitele znakového jazyka na středních školách'
        },
        {
            icon: <Accessibility sx={{ fontSize: 40 }} />,
            title: 'Přístupnost',
            description: 'Intuitivní rozhraní navržené pro efektivní učení znakového jazyka'
        }
    ];

    const categories = [
        { name: 'Čísla', count: 45, color: 'primary' },
        { name: 'Barvy', count: 23, color: 'secondary' },
        { name: 'Pozdravy', count: 18, color: 'success' },
        { name: 'Rodina', count: 32, color: 'warning' },
        { name: 'Jídlo', count: 67, color: 'error' },
        { name: 'Škola', count: 89, color: 'info' }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8,
                    mb: 6
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                                Aplikace pro výuku znakového jazyka
                            </Typography>
                            <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                                Moderní vzdělávací platforma pro studenty a učitele
                                znakového jazyka s pokročilými vyhledávacími funkcemi
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                <Button
                                    component={Link}
                                    to="/app/search"
                                    variant="contained"
                                    size="large"
                                    startIcon={<Search />}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': { bgcolor: 'grey.100' }
                                    }}
                                >
                                    Začít vyhledávat
                                </Button>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': { borderColor: 'grey.200', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Přihlásit se
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3
                                }}
                            >
                                <Box
                                    sx={{
                                        aspectRatio: '16/9',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px dashed rgba(255,255,255,0.3)'
                                    }}
                                >
                                    <Stack alignItems="center" spacing={2}>
                                        <PlayArrow sx={{ fontSize: 60, opacity: 0.7 }} />
                                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                            Demo video aplikace
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Features Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
                        Hlavní funkce
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                        Vše co potřebujete pro efektivní výuku znakového jazyka
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)' }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Categories Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
                        Kategorie znaků
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                        Procházejte znaky podle tematických kategorií
                    </Typography>

                    <Grid container spacing={2}>
                        {categories.map((category, index) => (
                            <Grid item xs={6} sm={4} md={2} key={index}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            boxShadow: 3,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    component={Link}
                                    to={`/app/categories/${category.name.toLowerCase()}`}
                                >
                                    <Category sx={{ fontSize: 30, color: `${category.color}.main`, mb: 1 }} />
                                    <Typography variant="h6" gutterBottom>
                                        {category.name}
                                    </Typography>
                                    <Chip
                                        label={`${category.count} znaků`}
                                        size="small"
                                        color={category.color as any}
                                        variant="outlined"
                                    />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Stats Section */}
                <Paper sx={{ p: 4, mb: 8, bgcolor: 'primary.main', color: 'white' }}>
                    <Grid container spacing={4} textAlign="center">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" component="div" gutterBottom>
                                500+
                            </Typography>
                            <Typography variant="h6">
                                Znaků v databázi
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" component="div" gutterBottom>
                                25+
                            </Typography>
                            <Typography variant="h6">
                                Kategorií
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" component="div" gutterBottom>
                                100%
                            </Typography>
                            <Typography variant="h6">
                                Zdarma pro školy
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* About Section */}
                <Box sx={{ mb: 8 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" component="h2" gutterBottom>
                                O projektu
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Tato aplikace vznikla jako náhrada současných YouTube materiálů
                                používaných na střední škole pro výuku tlumočníků znakového jazyka.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Cílem je poskytnout organizovanou, prohledávatelnou platformu
                                s pokročilými funkcemi pro vyhledávání znaků podle různých kritérií,
                                včetně budoucí možnosti hledat podle směru pohybu rukou a pozic prstů.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Aplikace je vyvíjena zdarma jako dar škole a komunitě
                                tlumočníků znakového jazyka.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center">
                                        <TrendingUp sx={{ mr: 2, color: 'success.main' }} />
                                        <Typography variant="h6">
                                            Budoucí funkce
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        • Vyhledávání podle pohybů rukou
                                    </Typography>
                                    <Typography variant="body2">
                                        • Analýza pozic prstů
                                    </Typography>
                                    <Typography variant="body2">
                                        • Rozpoznávání podobných znaků
                                    </Typography>
                                    <Typography variant="body2">
                                        • Personalizované učební plány
                                    </Typography>
                                    <Typography variant="body2">
                                        • Offline režim
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
