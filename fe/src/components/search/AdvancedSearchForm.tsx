import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Chip,
    Stack
} from '@mui/material';
import { ExpandMore, Search, Clear } from '@mui/icons-material';

interface SearchFilters {
    query: string;
    categoryId?: string;
    signType?: string;
    languageLevel?: string;
    region?: string;
    handShapeId?: string;
    locationId?: string;
    movementId?: string;
    palmOrientationId?: string;
    fingerOrientationId?: string;
    contactRegionId?: string;
    handArrangementId?: string;
}

interface Props {
    onSearch: (filters: SearchFilters) => void;
    isLoading?: boolean;
}

export function AdvancedSearchForm({ onSearch, isLoading = false }: Props) {
    const [filters, setFilters] = useState<SearchFilters>({
        query: ''
    });

    const handleInputChange = (field: keyof SearchFilters) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSearch = () => {
        onSearch(filters);
    };

    const handleClear = () => {
        const clearedFilters = { query: '' };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const getActiveFiltersCount = () => {
        return Object.entries(filters).filter(([key, value]) =>
            key !== 'query' && value && value.trim() !== ''
        ).length;
    };

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            {/* Main Search Bar */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Hledat znaky... (např. 'dobrý den', 'čísla', 'barvy')"
                    value={filters.query}
                    onChange={handleInputChange('query')}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: filters.query && (
                            <Clear
                                sx={{ cursor: 'pointer', color: 'text.secondary' }}
                                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                            />
                        )
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
            </Box>

            {/* Advanced Filters */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">
                        Pokročilé filtry
                        {getActiveFiltersCount() > 0 && (
                            <Chip
                                size="small"
                                label={getActiveFiltersCount()}
                                sx={{ ml: 1 }}
                                color="primary"
                            />
                        )}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {/* Basic Filters */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Typ znaku</InputLabel>
                                <Select
                                    value={filters.signType || ''}
                                    onChange={handleInputChange('signType')}
                                    label="Typ znaku"
                                >
                                    <MenuItem value="">Všechny</MenuItem>
                                    <MenuItem value="BASIC">Základní</MenuItem>
                                    <MenuItem value="COMPOUND">Složený</MenuItem>
                                    <MenuItem value="FINGERSPELLING">Prstová abeceda</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Úroveň jazyka</InputLabel>
                                <Select
                                    value={filters.languageLevel || ''}
                                    onChange={handleInputChange('languageLevel')}
                                    label="Úroveň jazyka"
                                >
                                    <MenuItem value="">Všechny</MenuItem>
                                    <MenuItem value="BEGINNER">Začátečník</MenuItem>
                                    <MenuItem value="INTERMEDIATE">Pokročilý</MenuItem>
                                    <MenuItem value="ADVANCED">Expert</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Region</InputLabel>
                                <Select
                                    value={filters.region || ''}
                                    onChange={handleInputChange('region')}
                                    label="Region"
                                >
                                    <MenuItem value="">Všechny</MenuItem>
                                    <MenuItem value="CZECH">Česká republika</MenuItem>
                                    <MenuItem value="SLOVAKIA">Slovensko</MenuItem>
                                    <MenuItem value="MORAVIA">Morava</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Component-based Filters */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Komponenty znaku
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Tvar ruky"
                                placeholder="ID komponenty tvaru ruky"
                                value={filters.handShapeId || ''}
                                onChange={handleInputChange('handShapeId')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Umístění"
                                placeholder="ID komponenty umístění"
                                value={filters.locationId || ''}
                                onChange={handleInputChange('locationId')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Pohyb"
                                placeholder="ID komponenty pohybu"
                                value={filters.movementId || ''}
                                onChange={handleInputChange('movementId')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Orientace dlaně"
                                placeholder="ID orientace dlaně"
                                value={filters.palmOrientationId || ''}
                                onChange={handleInputChange('palmOrientationId')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Orientace prstů"
                                placeholder="ID orientace prstů"
                                value={filters.fingerOrientationId || ''}
                                onChange={handleInputChange('fingerOrientationId')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Kontaktní oblast"
                                placeholder="ID kontaktní oblasti"
                                value={filters.contactRegionId || ''}
                                onChange={handleInputChange('contactRegionId')}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleSearch}
                    disabled={isLoading}
                    size="large"
                >
                    Vyhledat znaky
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    Vymazat filtry
                </Button>
            </Stack>
        </Box>
    );
}