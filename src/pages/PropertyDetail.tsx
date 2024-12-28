import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Box,
    Chip,
    Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Property } from '../types/property';

// Bu veriyi daha sonra API'den alacağız
const getPropertyById = (id: string): Property | undefined => {
    const properties: Property[] = [
        {
            _id: '1',
            id: '1',
            title: 'Merkezi Konumda Satılık Arsa',
            description: 'Şehir merkezinde, her türlü imara uygun arsa',
            price: 1500000,
            area: 500,
            location: {
                city: 'İstanbul',
                district: 'Beykoz',
                address: 'Örnek Mahallesi'
            },
            features: {
                zoning: 'Konut İmarlı',
                parcelNo: '123',
                blockNo: '456'
            },
            images: ['https://via.placeholder.com/800x600'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '2',
            id: '2',
            title: 'Deniz Manzaralı Arsa',
            description: 'Deniz manzaralı, villa imarlı arsa',
            price: 2500000,
            area: 750,
            location: {
                city: 'İzmir',
                district: 'Çeşme',
                address: 'Sahil Mahallesi'
            },
            features: {
                zoning: 'Villa İmarlı',
                parcelNo: '789',
                blockNo: '101'
            },
            images: ['https://via.placeholder.com/800x600'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ];

    return properties.find(p => p._id === id);
};

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const property = getPropertyById(id || '');

    if (!property) {
        return (
            <Container>
                <Typography variant="h5" color="error" sx={{ mt: 4 }}>
                    İlan bulunamadı
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* Sol Taraf - Resim ve Temel Bilgiler */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 0, overflow: 'hidden' }}>
                        <img
                            src={property.images[0]}
                            alt={property.title}
                            style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover'
                            }}
                        />
                    </Paper>

                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {property.title}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {property.price.toLocaleString('tr-TR')} TL
                        </Typography>
                        
                        <Box sx={{ my: 3 }}>
                            <Typography variant="body1" paragraph>
                                {property.description}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        {property.location.city}, {property.location.district}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    {property.location.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <SquareFootIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        {property.area} m²
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Arsa Özellikleri
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    İmar Durumu
                                </Typography>
                                <Typography variant="body1">
                                    {property.features.zoning}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Ada No
                                </Typography>
                                <Typography variant="body1">
                                    {property.features.blockNo}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Parsel No
                                </Typography>
                                <Typography variant="body1">
                                    {property.features.parcelNo}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Sağ Taraf - İlan Bilgileri */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            İlan Bilgileri
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                İlan Tarihi: {property.createdAt ? property.createdAt.toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Chip 
                                label={property.features.zoning}
                                color="primary"
                                sx={{ mr: 1 }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PropertyDetail; 