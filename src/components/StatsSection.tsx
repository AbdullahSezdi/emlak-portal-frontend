import React from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';

const StatsSection: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ my: 6 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #FFD700 0%, rgba(255,215,0,0.3) 100%)'
                    }
                }}
            >
                <Grid container spacing={0} sx={{ py: 4 }}>
                    <Grid item xs={12} md={3} sx={{ 
                        textAlign: 'center', 
                        borderRight: { md: '1px solid rgba(0,0,0,0.1)' },
                        p: 3
                    }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1e3c72',
                                mb: 1
                            }}
                        >
                            20+
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            Yıllık Tecrübe
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ 
                        textAlign: 'center',
                        borderRight: { md: '1px solid rgba(0,0,0,0.1)' },
                        p: 3
                    }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1e3c72',
                                mb: 1
                            }}
                        >
                            1000+
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            Başarılı Satış
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ 
                        textAlign: 'center',
                        borderRight: { md: '1px solid rgba(0,0,0,0.1)' },
                        p: 3
                    }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1e3c72',
                                mb: 1
                            }}
                        >
                            81
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            İlde Hizmet
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ 
                        textAlign: 'center',
                        p: 3
                    }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1e3c72',
                                mb: 1
                            }}
                        >
                            %98
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            Müşteri Memnuniyeti
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default StatsSection; 