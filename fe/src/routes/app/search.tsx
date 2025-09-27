import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { AdvancedSearchForm } from '../../components/search/AdvancedSearchForm';
import { SearchResults } from '../../components/search/SearchResults';

export const Route = createFileRoute('/app/search')({
    component: SearchPage,
});

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

interface SearchResults {
    content: any[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

function SearchPage() {
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [currentFilters, setCurrentFilters] = useState<SearchFilters>({ query: '' });
    const [currentPage, setCurrentPage] = useState(0);

    const performSearch = useCallback(async (filters: SearchFilters, page: number = 0) => {
        setIsLoading(true);
        setError('');

        try {
            // Build query parameters
            const params = new URLSearchParams();

            if (filters.query) params.append('query', filters.query);
            if (filters.categoryId) params.append('categoryId', filters.categoryId);
            if (filters.signType) params.append('signType', filters.signType);
            if (filters.languageLevel) params.append('languageLevel', filters.languageLevel);
            if (filters.region) params.append('region', filters.region);
            if (filters.handShapeId) params.append('handShapeId', filters.handShapeId);
            if (filters.locationId) params.append('locationId', filters.locationId);
            if (filters.movementId) params.append('movementId', filters.movementId);
            if (filters.palmOrientationId) params.append('palmOrientationId', filters.palmOrientationId);
            if (filters.fingerOrientationId) params.append('fingerOrientationId', filters.fingerOrientationId);
            if (filters.contactRegionId) params.append('contactRegionId', filters.contactRegionId);
            if (filters.handArrangementId) params.append('handArrangementId', filters.handArrangementId);

            // Add pagination
            params.append('page', page.toString());
            params.append('size', '12');

            // Choose endpoint based on filters
            const endpoint = Object.keys(filters).some(key => key !== 'query' && filters[key as keyof SearchFilters])
                ? '/api/search/signs'
                : '/api/search/signs/quick';

            const response = await fetch(`${endpoint}?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Chyba při vyhledávání: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
            setCurrentFilters(filters);
            setCurrentPage(page);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Neočekávaná chyba při vyhledávání');
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearch = useCallback((filters: SearchFilters) => {
        performSearch(filters, 0);
    }, [performSearch]);

    const handlePageChange = useCallback((page: number) => {
        performSearch(currentFilters, page);
    }, [performSearch, currentFilters]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Vyhledávání znaků
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Najděte znaky podle překladů, kategorií nebo jednotlivých komponent
                </Typography>
            </Box>

            {/* Search Form */}
            <Paper sx={{ mb: 4 }}>
                <AdvancedSearchForm
                    onSearch={handleSearch}
                    isLoading={isLoading}
                />
            </Paper>

            {/* Search Results */}
            <SearchResults
                results={searchResults}
                isLoading={isLoading}
                error={error}
                query={currentFilters.query}
                onPageChange={handlePageChange}
            />
        </Container>
    );
}