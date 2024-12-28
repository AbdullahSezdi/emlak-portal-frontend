import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider,
    Paper,
} from '@mui/material';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 'auto',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0) 100%),
                        repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 10px),
                        repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 10px)
                    `,
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Logo ve Hakkımızda */}
                    <Grid item xs={12} md={4}>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                mb: 3,
                                background: 'linear-gradient(45deg, #FFD700 30%, #FFF8DC 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Arsa Platformu
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                opacity: 0.9,
                                lineHeight: 1.8,
                                mb: 3,
                                letterSpacing: '0.3px'
                            }}
                        >
                            Türkiye'nin önde gelen premium arsa ve yatırım danışmanlığı platformu. 
                            20 yıllık tecrübemiz ve uzman kadromuzla, yatırımlarınıza değer katıyoruz.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton 
                                color="inherit" 
                                sx={{ 
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(255,215,0,0.15)'
                                    }
                                }}
                                href="https://facebook.com"
                                target="_blank"
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton 
                                color="inherit" 
                                sx={{ 
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(255,215,0,0.15)'
                                    }
                                }}
                                href="https://twitter.com"
                                target="_blank"
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton 
                                color="inherit" 
                                sx={{ 
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(255,215,0,0.15)'
                                    }
                                }}
                                href="https://instagram.com"
                                target="_blank"
                            >
                                <InstagramIcon />
                            </IconButton>
                            <IconButton 
                                color="inherit" 
                                sx={{ 
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(255,215,0,0.15)'
                                    }
                                }}
                                href="https://linkedin.com"
                                target="_blank"
                            >
                                <LinkedInIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Hızlı Erişim */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            fontWeight: 600, 
                            mb: 3,
                            color: '#FFD700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px'
                        }}>
                            Hızlı Erişim
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link 
                                href="/" 
                                color="inherit" 
                                sx={{ 
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                        opacity: 1,
                                        pl: 1,
                                        color: '#FFD700'
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: 0,
                                        height: '1px',
                                        bgcolor: '#FFD700',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                Anasayfa
                            </Link>
                            <Link 
                                href="/arsalar" 
                                color="inherit" 
                                sx={{ 
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                        opacity: 1,
                                        pl: 1,
                                        color: '#FFD700'
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: 0,
                                        height: '1px',
                                        bgcolor: '#FFD700',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                Arsalar
                            </Link>
                            <Link 
                                href="/hakkimizda" 
                                color="inherit" 
                                sx={{ 
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                        opacity: 1,
                                        pl: 1,
                                        color: '#FFD700'
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: 0,
                                        height: '1px',
                                        bgcolor: '#FFD700',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                Kurumsal
                            </Link>
                            <Link 
                                href="/iletisim" 
                                color="inherit" 
                                sx={{ 
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                        opacity: 1,
                                        pl: 1,
                                        color: '#FFD700'
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: 0,
                                        height: '1px',
                                        bgcolor: '#FFD700',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                İletişim
                            </Link>
                        </Box>
                    </Grid>

                    {/* İletişim */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            fontWeight: 600, 
                            mb: 3,
                            color: '#FFD700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px'
                        }}>
                            İletişim
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Paper 
                                    sx={{ 
                                        p: 1, 
                                        bgcolor: 'rgba(255,215,0,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,215,0,0.2)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <PhoneIcon sx={{ fontSize: 20, color: '#FFD700' }} />
                                </Paper>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Telefon
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#FFD700' }}>
                                        +90 (555) 123 45 67
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Paper 
                                    sx={{ 
                                        p: 1, 
                                        bgcolor: 'rgba(255,215,0,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,215,0,0.2)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <EmailIcon sx={{ fontSize: 20, color: '#FFD700' }} />
                                </Paper>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        E-posta
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#FFD700' }}>
                                        info@arsaplatformu.com
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Paper 
                                    sx={{ 
                                        p: 1, 
                                        bgcolor: 'rgba(255,215,0,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,215,0,0.2)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <LocationIcon sx={{ fontSize: 20, color: '#FFD700' }} />
                                </Paper>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Adres
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#FFD700' }}>
                                        Merkez Mah. Arsa Cad. No:1<br />
                                        Kadıköy / İstanbul
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* İletişime Geç */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            fontWeight: 600, 
                            mb: 3,
                            color: '#FFD700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px'
                        }}>
                            İletişime Geç
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(255,215,0,0.15)'
                                    }
                                }}
                                onClick={() => window.open('https://wa.me/905551234567', '_blank')}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <WhatsAppIcon sx={{ fontSize: 24, color: '#FFD700' }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            WhatsApp
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#FFD700' }}>
                                            Hemen Mesaj Gönder
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: 'rgba(255,215,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,215,0,0.2)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(255,215,0,0.15)'
                                    }
                                }}
                                onClick={() => window.location.href = 'tel:+905551234567'}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PhoneIcon sx={{ fontSize: 24, color: '#FFD700' }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Telefon
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#FFD700' }}>
                                            Hemen Ara
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ 
                    my: 6, 
                    borderColor: 'rgba(255,215,0,0.2)',
                    '&::before, &::after': {
                        borderColor: 'rgba(255,215,0,0.2)'
                    }
                }} />

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        © {new Date().getFullYear()} Arsa Platformu. Tüm hakları saklıdır.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link 
                            href="/gizlilik" 
                            color="inherit" 
                            sx={{ 
                                textDecoration: 'none',
                                opacity: 0.9,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    opacity: 1,
                                    color: '#FFD700'
                                }
                            }}
                        >
                            Gizlilik Politikası
                        </Link>
                        <Link 
                            href="/kullanim-kosullari" 
                            color="inherit" 
                            sx={{ 
                                textDecoration: 'none',
                                opacity: 0.9,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    opacity: 1,
                                    color: '#FFD700'
                                }
                            }}
                        >
                            Kullanım Koşulları
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 