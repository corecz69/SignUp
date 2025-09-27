import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Pagination,
    Skeleton,
    Alert,
    Chip,
    Stack
} from '@mui/material';
import { SignCard } from '../cards/sign-card';

interface Sign {
    id: string;
    translations?: string[];
    explanation?: string;
    videoFileName?: string;
    category?: {
        id: string;
        name: string;
    };
    type?: string;
    languageLevel?: string;
    region?: string;
}

interface SearchResultsProps {
    results: {
        content: Sign[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    } | null;
    isLoading: boolean;
    error?: string;
    query?: string;
    onPageChange: (page: number) => void;
}

export function SearchResults({
    results,
    isLoading,
    error,
    query,
    onPageChange
}: SearchResultsProps) {
    if (isLoading) {
        return (
            <Box>
                <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Při vyhledávání došlo k chybě: {error}
            </Alert>
        );
    }

    if (!results || results.content.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    {query
                        ? `Nenalezeny žádné znaky pro dotaz "${query}"`
                        : 'Použijte vyhledávání pro nalezení znaků'
                    }
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Zkuste upravit vyhledávací dotaz nebo filtry
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Results Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" component="h2">
                    Výsledky vyhledávání
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Nalezeno {results.totalElements} znaků
                    </Typography>
                    {query && (
                        <Chip
                            label={`"${query}"`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Stack>
            </Box>

            {/* Results Grid */}
            <Grid container spacing={2}>
                {results.content.map((sign) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={sign.id}>
                        <SignCard
                            id={sign.id}
                            translations={sign.translations || []}
                            explanation={sign.explanation || ''}
                            videoFileName={sign.videoFileName || ''}
                            categoryName={sign.category?.name}
                            type={sign.type}
                            languageLevel={sign.languageLevel}
                            region={sign.region}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {results.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={results.totalPages}
                        page={results.number + 1}
                        onChange={(_, page) => onPageChange(page - 1)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Results info */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 2 }}
            >
                Stránka {results.number + 1} z {results.totalPages}
                {' '}(zobrazeno {results.content.length} z {results.totalElements} znaků)
            </Typography>
        </Box>
    );
}