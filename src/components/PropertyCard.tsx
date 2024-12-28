import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Paper
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    SquareFoot as SquareFootIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

interface Property {
    _id: string;
    title: string;
    description: string;
    price: number;
    area: number;
    location: {
        city: string;
        district: string;
        address: string;
    };
    features: {
        zoning: string;
        [key: string]: string;
    };
    images: string[];
}

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    '&::before': {
                        opacity: 1
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #FFD700 0%, rgba(255,215,0,0.2) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={property.images[0] ? `/uploads/${property.images[0]}` : '/placeholder.jpg'}
                alt={property.title}
                sx={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 2,
                        color: '#1e3c72'
                    }}
                >
                    {property.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: '#FFD700', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                        {property.location.city}, {property.location.district}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Paper
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 0.75,
                            bgcolor: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            borderRadius: 2
                        }}
                    >
                        <SquareFootIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            {property.area} m²
                        </Typography>
                    </Paper>
                    <Paper
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 0.75,
                            bgcolor: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            borderRadius: 2
                        }}
                    >
                        <AttachMoneyIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                maximumFractionDigits: 0
                            }).format(property.price)}
                        </Typography>
                    </Paper>
                </Box>

                <Chip
                    label={property.features.zoning}
                    sx={{
                        bgcolor: 'rgba(255,215,0,0.1)',
                        color: '#1e3c72',
                        border: '1px solid rgba(255,215,0,0.3)',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                            px: 1
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default PropertyCard; 