import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    TextField,
    MenuItem,
    Box,
    Slider,
    FormControl,
    InputLabel,
    Select,
    Chip,
    InputAdornment,
    Paper,
    CardActionArea,
    Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import MapIcon from '@mui/icons-material/Map';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import { Property } from '../types/property';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { authApi } from '../services/auth';
import { propertyApi } from '../services/api';
import Footer from '../components/Footer';
import StatsSection from '../components/StatsSection';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ShareIcon from '@mui/icons-material/Share';

// Şehir ve ilçe verileri
interface CityDistricts {
    [key: string]: string[];
}

const cityDistricts: CityDistricts = {
    'Adana': ['Seyhan', 'Yüreğir', 'Çukurova', 'Sarıçam', 'Karaisalı'],
    'Adıyaman': ['Merkez', 'Kahta', 'Besni', 'Gölbaşı', 'Gerger'],
    'Afyonkarahisar': ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Emirdağ'],
    'Ağrı': ['Merkez', 'Patnos', 'Doğubayazıt', 'Diyadin', 'Eleşkirt'],
    'Amasya': ['Merkez', 'Merzifon', 'Suluova', 'Taşova', 'Göynücek'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı'],
    'Antalya': ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kaş', 'Side'],
    'Artvin': ['Merkez', 'Hopa', 'Borçka', 'Arhavi', 'Ardanuç'],
    'Aydın': ['Efeler', 'Nazilli', 'Söke', 'Kuşadası', 'Didim'],
    'Balıkesir': ['Altıeylül', 'Karesi', 'Edremit', 'Bandırma', 'Gönen'],
    'Bilecik': ['Merkez', 'Bozüyük', 'Osmaneli', 'Söğüt', 'Pazaryeri'],
    'Bingöl': ['Merkez', 'Genç', 'Solhan', 'Karlıova', 'Adaklı'],
    'Bitlis': ['Merkez', 'Tatvan', 'Ahlat', 'Güroymak', 'Mutki'],
    'Bolu': ['Merkez', 'Gerede', 'Mudurnu', 'Mengen', 'Göynük'],
    'Burdur': ['Merkez', 'Bucak', 'Gölhisar', 'Yeşilova', 'Ağlasun'],
    'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mudanya', 'Gürsu', 'Kestel'],
    'Çanakkale': ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Ayvacık'],
    'Çankırı': ['Merkez', 'Çerkeş', 'Ilgaz', 'Kurşunlu', 'Orta'],
    'Çorum': ['Merkez', 'Sungurlu', 'Osmancık', 'İskilip', 'Alaca'],
    'Denizli': ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas'],
    'Diyarbakır': ['Bağlar', 'Kayapınar', 'Yenişehir', 'Sur', 'Ergani'],
    'Edirne': ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa'],
    'Elazığ': ['Merkez', 'Kovancılar', 'Karakoçan', 'Palu', 'Arıcak'],
    'Erzincan': ['Merkez', 'Tercan', 'Üzümlü', 'Refahiye', 'Kemaliye'],
    'Erzurum': ['Yakutiye', 'Palandöken', 'Aziziye', 'Horasan', 'Oltu'],
    'Eskişehir': ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Mahmudiye'],
    'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı'],
    'Giresun': ['Merkez', 'Bulancak', 'Espiye', 'Görele', 'Tirebolu'],
    'Gümüşhane': ['Merkez', 'Kelkit', 'Şiran', 'Kürtün', 'Torul'],
    'Hakkari': ['Merkez', 'Yüksekova', 'Şemdinli', 'Çukurca', 'Derecik'],
    'Hatay': ['Antakya', 'İskenderun', 'Defne', 'Dörtyol', 'Samandağ'],
    'Isparta': ['Merkez', 'Yalvaç', 'Eğirdir', 'Şarkikaraağaç', 'Gelendost'],
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Beykoz', 'Maltepe', 'Ataşehir', 'Fatih', 'Beyoğlu', 'Bakırköy', 'Başakşehir', 'Sarıyer', 'Pendik', 'Kartal'],
    'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere', 'Güzelbahçe', 'Çeşme', 'Urla', 'Foça'],
    'Kars': ['Merkez', 'Sarıkamış', 'Kağızman', 'Digor', 'Selim'],
    'Kastamonu': ['Merkez', 'Tosya', 'Taşköprü', 'İnebolu', 'Cide'],
    'Kayseri': ['Kocasinan', 'Melikgazi', 'Talas', 'Develi', 'Yahyalı'],
    'Kırklareli': ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Pınarhisar'],
    'Kırşehir': ['Merkez', 'Kaman', 'Mucur', 'Çiçekdağı', 'Akpınar'],
    'Kocaeli': ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Gölcük', 'Derince', 'Çayırova'],
    'Konya': ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir'],
    'Kütahya': ['Merkez', 'Tavşanlı', 'Simav', 'Gediz', 'Emet'],
    'Malatya': ['Yeşilyurt', 'Battalgazi', 'Doğanşehir', 'Akçadağ', 'Darende'],
    'Manisa': ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli'],
    'Kahramanmaraş': ['Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Türkoğlu'],
    'Mardin': ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik'],
    'Muğla': ['Menteşe', 'Bodrum', 'Fethiye', 'Marmaris', 'Milas'],
    'Muş': ['Merkez', 'Malazgirt', 'Bulanık', 'Varto', 'Hasköy'],
    'Nevşehir': ['Merkez', 'Ürgüp', 'Avanos', 'Gülşehir', 'Hacıbektaş'],
    'Niğde': ['Merkez', 'Bor', 'Çamardı', 'Ulukışla', 'Altunhisar'],
    'Ordu': ['Altınordu', 'Ünye', 'Fatsa', 'Perşembe', 'Kumru'],
    'Rize': ['Merkez', 'Çayeli', 'Ardeşen', 'Pazar', 'Fındıklı'],
    'Sakarya': ['Adapazarı', 'Serdivan', 'Erenler', 'Akyazı', 'Hendek'],
    'Samsun': ['İlkadım', 'Atakum', 'Canik', 'Bafra', 'Çarşamba'],
    'Siirt': ['Merkez', 'Kurtalan', 'Pervari', 'Baykan', 'Şirvan'],
    'Sinop': ['Merkez', 'Boyabat', 'Gerze', 'Ayancık', 'Durağan'],
    'Sivas': ['Merkez', 'Şarkışla', 'Yıldızeli', 'Suşehri', 'Zara'],
    'Tekirdağ': ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Malkara'],
    'Tokat': ['Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile'],
    'Trabzon': ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra'],
    'Tunceli': ['Merkez', 'Pertek', 'Çemişgezek', 'Hozat', 'Ovacık'],
    'Şanlıurfa': ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir'],
    'Uşak': ['Merkez', 'Banaz', 'Eşme', 'Ulubey', 'Karahallı'],
    'Van': ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Çaldıran'],
    'Yozgat': ['Merkez', 'Sorgun', 'Akdağmadeni', 'Yerköy', 'Boğazlıyan'],
    'Zonguldak': ['Merkez', 'Ereğli', 'Çaycuma', 'Devrek', 'Kozlu'],
    'Aksaray': ['Merkez', 'Ortaköy', 'Eskil', 'Gülağaç', 'Güzelyurt'],
    'Bayburt': ['Merkez', 'Demirözü', 'Aydıntepe'],
    'Karaman': ['Merkez', 'Ermenek', 'Sarıveliler', 'Ayrancı', 'Başyayla'],
    'Kırıkkale': ['Merkez', 'Yahşihan', 'Keskin', 'Delice', 'Sulakyurt'],
    'Batman': ['Merkez', 'Kozluk', 'Sason', 'Beşiri', 'Gercüş'],
    'Şırnak': ['Merkez', 'Cizre', 'Silopi', 'İdil', 'Uludere'],
    'Bartın': ['Merkez', 'Amasra', 'Kurucaşile', 'Ulus'],
    'Ardahan': ['Merkez', 'Göle', 'Çıldır', 'Hanak', 'Posof'],
    'Iğdır': ['Merkez', 'Tuzluca', 'Aralık', 'Karakoyunlu'],
    'Yalova': ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu'],
    'Karabük': ['Merkez', 'Safranbolu', 'Yenice', 'Eskipazar', 'Eflani'],
    'Kilis': ['Merkez', 'Musabeyli', 'Elbeyli', 'Polateli'],
    'Osmaniye': ['Merkez', 'Kadirli', 'Düziçi', 'Bahçe', 'Toprakkale'],
    'Düzce': ['Merkez', 'Akçakoca', 'Kaynaşlı', 'Yığılca', 'Gölyaka']
};

const cities = Object.keys(cityDistricts);

const CityList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const cities = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
        'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
        'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli'
    ].sort();

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            {/* Arama Kutusu */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Şehir Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: 'primary.light',
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Şehir Grid'i */}
            <Grid container spacing={2} sx={{ p: 2 }}>
                {filteredCities.map((city) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={city}>
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" component="div">
                                {city}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

// Property Details Modal Component
const PropertyDetailsModal: React.FC<{
    property: Property;
    open: boolean;
    onClose: () => void;
}> = ({ property, open, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === property.images.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '12px',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ 
                position: 'relative',
                bgcolor: '#f8f9fa'
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        zIndex: 1,
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Image Slider */}
                <Box sx={{ 
                    position: 'relative',
                    height: '400px',
                    bgcolor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Box
                        component="img"
                        src={property.images[currentImageIndex]}
                        alt={`Property image ${currentImageIndex + 1}`}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                    
                    {/* Navigation Arrows */}
                    <IconButton
                        onClick={handlePrevImage}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleNextImage}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <NavigateNextIcon />
                    </IconButton>

                    {/* Image Counter */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        {property.images.map((_, index) => (
                            <FiberManualRecordIcon
                                key={index}
                                sx={{
                                    fontSize: 12,
                                    color: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </Box>
                </Box>

                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        {/* Sol Taraf - Detaylar */}
                        <Grid item xs={12} md={8}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 700,
                                    color: '#1e3c72',
                                    mb: 2
                                }}
                            >
                                {property.title}
                            </Typography>

                            <Box sx={{ 
                                display: 'flex',
                                gap: 3,
                                mb: 4
                            }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: 'rgba(30,60,114,0.08)',
                                    borderRadius: '8px',
                                    py: 1,
                                    px: 2
                                }}>
                                    <LocationOnIcon sx={{ color: '#1e3c72' }} />
                                    <Typography>
                                        {property.location.city}, {property.location.district}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: 'rgba(30,60,114,0.08)',
                                    borderRadius: '8px',
                                    py: 1,
                                    px: 2
                                }}>
                                    <SquareFootIcon sx={{ color: '#1e3c72' }} />
                                    <Typography>
                                        {property.area} m²
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: '#1e3c72',
                                    mb: 2
                                }}
                            >
                                Arsa Özellikleri
                            </Typography>

                            <Table sx={{ mb: 4 }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, width: '30%', border: 'none' }}>
                                            İmar Durumu
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }}>
                                            {property.features.zoning || 'Belirtilmemiş'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, border: 'none' }}>
                                            Ada No
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }}>
                                            {property.features.blockNumber || 'Belirtilmemiş'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, border: 'none' }}>
                                            Parsel No
                                        </TableCell>
                                        <TableCell sx={{ border: 'none' }}>
                                            {property.features.parcelNumber || 'Belirtilmemiş'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: '#1e3c72',
                                    mb: 2
                                }}
                            >
                                Açıklama
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    mb: 4
                                }}
                            >
                                {property.description}
                            </Typography>
                        </Grid>

                        {/* Sağ Taraf - İletişim ve Fiyat */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1e3c72',
                                        mb: 4,
                                        fontSize: '2.5rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    {property.price.toLocaleString('tr-TR')} TL
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<WhatsAppIcon />}
                                    sx={{
                                        mb: 2,
                                        bgcolor: '#25D366',
                                        height: '48px',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            bgcolor: '#128C7E'
                                        }
                                    }}
                                >
                                    WhatsApp ile İlet
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<PhoneIcon />}
                                    sx={{
                                        mb: 2,
                                        bgcolor: '#1e3c72',
                                        height: '48px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Telefon ile Ara
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<ShareIcon />}
                                    onClick={() => {
                                        const shareData = {
                                            title: property.title,
                                            text: `${property.title} - ${property.price.toLocaleString('tr-TR')} TL\n${property.location.city}, ${property.location.district}\n${property.area} m²`,
                                            url: window.location.href
                                        };

                                        if (navigator.share) {
                                            navigator.share(shareData)
                                                .catch((error) => console.log('Error sharing:', error));
                                        }
                                    }}
                                    sx={{
                                        color: '#1e3c72',
                                        borderColor: '#1e3c72',
                                        height: '48px',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            bgcolor: 'rgba(30, 60, 114, 0.04)'
                                        }
                                    }}
                                >
                                    İlanı Paylaş
                                </Button>

                                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 2
                                        }}
                                    >
                                        İlan Bilgileri
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: 'text.secondary',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span>İlan No:</span>
                                            <span style={{ fontWeight: 500 }}>{property.id}</span>
                                        </Box>
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: 'text.secondary',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span>İlan Tarihi:</span>
                                            <span style={{ fontWeight: 500 }}>
                                                {property.createdAt ? new Date(property.createdAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                            </span>
                                        </Box>
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: 'text.secondary',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span>Son Güncelleme:</span>
                                            <span style={{ fontWeight: 500 }}>
                                                {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                            </span>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Grid item xs={12} sm={6} md={4}>
            <Card 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            '& .card-media': {
                                transform: 'scale(1.1)',
                            },
                            '& .more-details-btn': {
                                backgroundColor: '#1e3c72',
                                color: 'white',
                            }
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                            component="img"
                            height="240"
                            image={property.images[0]}
                            alt={property.title}
                            className="card-media"
                            sx={{ 
                                transition: 'transform 0.3s ease-in-out',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                                p: 2.5,
                                pt: 6
                            }}
                        >
                            <Chip 
                                label={property.features.zoning}
                                sx={{ 
                                    backgroundColor: 'rgba(52, 152, 219, 0.9)',
                                    color: 'white',
                                    fontWeight: 500,
                                    borderRadius: '20px',
                                    mb: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(52, 152, 219, 1)',
                                        boxShadow: '0 0 12px rgba(52, 152, 219, 0.5)'
                                    }
                                }}
                            />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    mb: 0.5
                                }}
                            >
                                {property.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOnIcon sx={{ color: 'white', fontSize: 18, opacity: 0.9 }} />
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        color: 'white',
                                        opacity: 0.9,
                                        fontWeight: 400,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                {property.location.city}, {property.location.district}
                            </Typography>
                        </Box>
                    </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            pb: 2,
                            borderBottom: '1px solid',
                            borderColor: 'rgba(0,0,0,0.08)'
                        }}>
                            <MonetizationOnOutlinedIcon 
                                sx={{ 
                                    color: '#1e3c72',
                                    fontSize: 28,
                                    mr: 1,
                                    opacity: 0.9
                                }} 
                            />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#1e3c72',
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    lineHeight: 1
                                }}
                            >
                                {property.price.toLocaleString('tr-TR')} TL
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                bgcolor: 'rgba(0,0,0,0.03)',
                                borderRadius: '8px',
                                py: 0.75,
                                px: 1.5
                            }}>
                                <LocationOnIcon sx={{ mr: 0.5, color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {property.location.district}
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                bgcolor: 'rgba(0,0,0,0.03)',
                                borderRadius: '8px',
                                py: 0.75,
                                px: 1.5
                            }}>
                                <SquareFootIcon sx={{ mr: 0.5, color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {property.area} m²
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            fullWidth
                            variant="outlined"
                            className="more-details-btn"
                            onClick={() => setIsModalOpen(true)}
                            sx={{
                                borderColor: '#1e3c72',
                                color: '#1e3c72',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#1e3c72',
                                    borderColor: '#1e3c72',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(30,60,114,0.2)'
                                }
                            }}
                        >
                            Detayları Gör
                        </Button>
                    </CardContent>
            </Card>
        </Grid>
            <PropertyDetailsModal
                property={property}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

// Hero Section ve Filtreleme bölümü için yeni stil
const FilterSection: React.FC<{
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    selectedDistrict: string;
    setSelectedDistrict: (district: string) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    areaRange: number[];
    handleAreaInputChange: (index: number, value: string) => void;
}> = ({
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    priceRange,
    setPriceRange,
    areaRange,
    handleAreaInputChange
}) => {
    const theme = useTheme();

    return (
        <Box 
            sx={{ 
                position: 'relative',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: { xs: 2, md: 4 },
                color: 'white',
                p: { xs: 3, sm: 4, md: 5 },
                mb: { xs: 4, md: 6 },
                minHeight: { xs: '420px', sm: '460px', md: '500px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.07,
                    zIndex: 1
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%),
                        linear-gradient(240deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%),
                        repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 30px),
                        repeating-linear-gradient(-45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 30px)
                    `,
                    zIndex: 2
                }
            }}
        >
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: `
                    radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%),
                    radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)
                `,
                zIndex: 3
            }} />

            {/* Hero Content */}
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 4 }}>
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: { xs: 4, sm: 5, md: 6 }
                }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 800,
                            mb: { xs: 1.5, sm: 2 },
                            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            fontSize: { xs: '2rem', sm: '2.75rem', md: '4rem' },
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                            px: { xs: 1, sm: 0 },
                            '& span': {
                                background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: 'none'
                            }
                        }}
                    >
                        <span>Hayalinizdeki</span> Arsayı <span>Bulun</span>
                    </Typography>
                    <Box 
                        sx={{ 
                            display: 'inline-block',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '50px',
                            padding: { xs: '0.4em 1em', sm: '0.5em 1.5em' },
                            backdropFilter: 'blur(4px)',
                            maxWidth: '800px',
                            margin: '0 auto',
                            mx: { xs: 2, sm: 'auto' }
                        }}
                    >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                fontWeight: 400,
                                fontStyle: 'italic',
                                letterSpacing: '0.02em',
                                lineHeight: 1.6,
                                color: 'rgba(255, 255, 255, 0.95)',
                        }}
                    >
                        Türkiye'nin en geniş arsa portföyü ile sizlere hizmet veriyoruz
                    </Typography>
                    </Box>
                </Box>

                {/* Filters */}
                <Paper 
                    elevation={24}
                    sx={{ 
                        p: { xs: 3, sm: 3.5, md: 4 },
                        mx: 'auto',
                        maxWidth: '1200px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        position: 'relative',
                        zIndex: 3,
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: `
                            0 10px 40px rgba(0,0,0,0.12),
                            0 4px 12px rgba(0,0,0,0.06),
                            inset 0 2px 4px rgba(255,255,255,0.8)
                        `,
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.98)',
                            boxShadow: `
                                0 12px 48px rgba(0,0,0,0.15),
                                0 6px 16px rgba(0,0,0,0.08),
                                inset 0 2px 4px rgba(255,255,255,0.9)
                            `,
                        },
                        '& .MuiFormControl-root': {
                            '& .MuiFilledInput-root': {
                                '&::before, &::after': {
                                    display: 'none'
                                }
                            }
                        }
                    }}
                >
                    <Grid 
                        container 
                        spacing={{ xs: 2, md: 3 }} 
                        alignItems="stretch"
                        sx={{
                            '& .MuiGrid-item': {
                                display: 'flex',
                                flexDirection: 'column'
                            }
                        }}
                    >
                        <Grid item xs={12} md={3}>
                            <FormControl 
                                fullWidth 
                                variant="filled" 
                                size="small"
                                sx={{
                                    height: '100%',
                                    '& .MuiInputBase-root': {
                                        height: '48px',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(0, 0, 0, 0.12)',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&::before, &::after': {
                                            display: 'none'
                                        }
                                    },
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        paddingLeft: '12px',
                                        paddingRight: '12px',
                                        height: '48px !important',
                                        '&.MuiInputBase-input': {
                                            paddingTop: '0',
                                            paddingBottom: '0'
                                        }
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Şehir Seçin
                                    <Tooltip
                                        title="Arsanızın bulunduğu şehri seçin"
                                        arrow
                                        placement="top"
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                    </Tooltip>
                                </Typography>
                                <Select
                                    value={selectedCity}
                                    onChange={(e) => {
                                        const newCity = e.target.value;
                                        setSelectedCity(newCity);
                                        // Şehir değiştiğinde veya "Tüm Şehirler" seçildiğinde ilçeyi sıfırla
                                        setSelectedDistrict('');
                                    }}
                                    displayEmpty
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <MapIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                                            <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                                                {selected || "Tüm Şehirler"}
                                            </Typography>
                                        </Box>
                                    )}
                                >
                                    <MenuItem value="">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <MapIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                                            <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                                                <em>Tüm Şehirler</em>
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    {cities.map((city) => (
                                        <MenuItem key={city} value={city}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <MapIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                                            {city}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl 
                                fullWidth 
                                variant="filled" 
                                size="small"
                                disabled={!selectedCity}
                                sx={{
                                    height: '100%',
                                    '& .MuiInputBase-root': {
                                        height: '48px',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(0, 0, 0, 0.12)',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&::before, &::after': {
                                            display: 'none'
                                        }
                                    },
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        paddingLeft: '12px',
                                        paddingRight: '12px',
                                        height: '48px !important',
                                        '&.MuiInputBase-input': {
                                            paddingTop: '0',
                                            paddingBottom: '0'
                                        }
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    İlçe Seçin
                                    <Tooltip
                                        title="Arsanızın bulunduğu ilçeyi seçin"
                                        arrow
                                        placement="top"
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                    </Tooltip>
                                </Typography>
                                <Select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        width: '100%',
                                        height: '48px',
                                        backgroundColor: 'white',
                                        '&:hover': {
                                            backgroundColor: 'white'
                                        },
                                        '& .MuiSelect-select': {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <LocationOnIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
                                            {selected || 'Tüm İlçeler'}
                                        </Box>
                                    )}
                                >
                                    <MenuItem value="">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <LocationOnIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                            <Typography>Tüm İlçeler</Typography>
                                        </Box>
                                    </MenuItem>
                                    {selectedCity && cityDistricts[selectedCity]?.map((district) => (
                                        <MenuItem key={district} value={district}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <LocationOnIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                                <Typography>
                                            {district}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ height: '100%' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Fiyat Aralığı
                                    <Tooltip
                                        title="Aradığınız arsa için minimum ve maksimum fiyat aralığını belirleyin"
                                        arrow
                                        placement="top"
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                    </Tooltip>
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1,
                                    '& .MuiTextField-root': {
                                        flex: 1,
                                        '& .MuiInputBase-root': {
                                            height: '48px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            },
                                            '&::before, &::after': {
                                                display: 'none'
                                            },
                                            '& input': {
                                                height: '48px',
                                                padding: '0 12px',
                                                boxSizing: 'border-box'
                                            }
                                        }
                                    }
                                }}>
                                    <TextField
                                        variant="filled"
                                        placeholder="Min"
                                        type="number"
                                        value={priceRange[0] === 0 ? '' : priceRange[0]}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? 0 : Number(e.target.value);
                                            if (!isNaN(value)) {
                                                setPriceRange([value, priceRange[1]]);
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">TL</InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        variant="filled"
                                        placeholder="Max"
                                        type="number"
                                        value={priceRange[1] === 0 ? '' : priceRange[1]}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? 0 : Number(e.target.value);
                                            if (!isNaN(value)) {
                                                setPriceRange([priceRange[0], value]);
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">TL</InputAdornment>,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ height: '100%' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                Alan (m²)
                                    <Tooltip
                                        title="Aradığınız arsa için minimum ve maksimum alan büyüklüğünü belirleyin"
                                        arrow
                                        placement="top"
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                    </Tooltip>
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 1,
                                    '& .MuiTextField-root': {
                                        flex: 1,
                                        '& .MuiInputBase-root': {
                                            height: '48px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            },
                                            '&::before, &::after': {
                                                display: 'none'
                                            },
                                            '& input': {
                                                height: '48px',
                                                padding: '0 12px',
                                                boxSizing: 'border-box'
                                            }
                                        }
                                    }
                            }}>
                                <TextField
                                    variant="filled"
                                        placeholder="Min"
                                    type="number"
                                        value={areaRange[0] === 0 ? '' : areaRange[0]}
                                    onChange={(e) => handleAreaInputChange(0, e.target.value)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    variant="filled"
                                        placeholder="Max"
                                    type="number"
                                        value={areaRange[1] === 0 ? '' : areaRange[1]}
                                    onChange={(e) => handleAreaInputChange(1, e.target.value)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                                    }}
                                />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

const HomePage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
    const [areaRange, setAreaRange] = useState<number[]>([0, 0]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    // Backend'den verileri çek
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await propertyApi.getAllProperties();
                setAllProperties(response.data);
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    // Şehir değiştiğinde ilçeyi sıfırla
    useEffect(() => {
        setSelectedDistrict('');
    }, [selectedCity]);

    // Filtreleme fonksiyonu
    useEffect(() => {
        let filtered = allProperties;

        // Şehir filtresi
        if (selectedCity) {
            filtered = filtered.filter(property =>
                property?.location?.city === selectedCity
            );
        }

        // İlçe filtresi
        if (selectedDistrict) {
            filtered = filtered.filter(property =>
                property?.location?.district === selectedDistrict
            );
        }

        // Fiyat aralığı filtresi
        if (priceRange[0] > 0 || priceRange[1] > 0) {
            filtered = filtered.filter(property => {
                if (!property?.price) return false;
                const minPrice = priceRange[0] > 0 ? priceRange[0] : 0;
                const maxPrice = priceRange[1] > 0 ? priceRange[1] : Infinity;
                return property.price >= minPrice && property.price <= maxPrice;
            });
        }

        // Alan aralığı filtresi
        if (areaRange[0] > 0 || areaRange[1] > 0) {
            filtered = filtered.filter(property => {
                if (!property?.area) return false;
                const minArea = areaRange[0] > 0 ? areaRange[0] : 0;
                const maxArea = areaRange[1] > 0 ? areaRange[1] : Infinity;
                return property.area >= minArea && property.area <= maxArea;
            });
        }

        setProperties(filtered);
    }, [selectedCity, selectedDistrict, priceRange, areaRange, allProperties]);

    const handleAreaInputChange = (index: number, value: string) => {
        const newValue = value === '' ? 0 : Number(value);
        if (!isNaN(newValue) && newValue >= 0) {
            const newAreaRange = [...areaRange];
            newAreaRange[index] = newValue;
            setAreaRange(newAreaRange);
        }
    };

    const handleAdminClick = () => {
        if (authApi.isAuthenticated()) {
            navigate('/admin');
        } else {
            navigate('/login');
        }
    };

    // Sayfa değişim handler'ı
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Mevcut sayfadaki arsaları hesapla
    const currentProperties = properties.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            {/* Top Bar */}
            <Box sx={{ 
                bgcolor: '#1e3c72',
                py: 1,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {/* Contact Info */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 3
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                color: 'white'
                            }}>
                                <PhoneIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    +90 (555) 123 4567
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                color: 'white'
                            }}>
                                <EmailIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    info@arsaportali.com
                                </Typography>
                            </Box>
                        </Box>

                        {/* Quick Links */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 3
                        }}>
                            {['Hakkımızda', 'Destek', 'VIP Hizmetler'].map((text) => (
                                <Typography 
                                    key={text}
                                    variant="body2" 
                                    sx={{ 
                                        color: 'white',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    {text}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Header */}
            <Box sx={{ 
                bgcolor: 'white', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                borderBottom: '1px solid',
                borderColor: 'rgba(0,0,0,0.1)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 2
                    }}>
                        <Typography 
                            variant="h5" 
                            component="h1"
                            sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                color: '#1e3c72',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        >
                            Arsa Portalı
                        </Typography>
                        <Button 
                            color="primary" 
                            onClick={handleAdminClick}
                            variant="contained"
                            sx={{ 
                                px: 4,
                                py: 1.2,
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                boxShadow: '0 4px 12px rgba(30, 60, 114, 0.2)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(30, 60, 114, 0.3)',
                                }
                            }}
                        >
                            Admin Panel
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box sx={{
                position: 'relative',
                height: '70vh',
                minHeight: '500px',
                maxHeight: '700px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/images/hero-landscape.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(2px)',
                    transform: 'scale(1.1)',
                    zIndex: 0
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1
                }
            }}>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ 
                        maxWidth: '1200px',
                        margin: '0 auto',
                        textAlign: 'center',
                        mt: -5
                    }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 700,
                                mb: 3,
                                fontFamily: "'Playfair Display', serif",
                                color: '#FFD700',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            Hemen Bugün Yatırıma Başlayın!
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.2rem', md: '1.8rem' },
                                fontWeight: 400,
                                mb: 6,
                                color: 'white',
                                opacity: 0.95,
                                maxWidth: '800px',
                                margin: '0 auto',
                                fontFamily: "'Roboto', sans-serif",
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                lineHeight: 1.5
                            }}
                        >
                            Ticari imarlı, konut imarlı, villa imarlı arsalar ile geleceğinize yatırım yapın.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ 
                pb: 8, 
                pt: { xs: 2, md: 4 },
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(240, 244, 248, 0.6) 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* İstatistikler Bölümü */}
                <StatsSection />

                {/* Filtreleme Bölümü */}
            <FilterSection 
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                areaRange={areaRange}
                handleAreaInputChange={handleAreaInputChange}
            />

                {/* İlan Listesi */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    mt: 6
                }}>
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        sx={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            color: '#1e3c72',
                            letterSpacing: '-0.01em',
                            fontSize: { xs: '1.75rem', md: '2.25rem' }
                        }}
                    >
                    Satılık Arsalar
                </Typography>
                <Chip 
                    label={`${properties.length} ilan`}
                    color="primary"
                        sx={{ 
                            fontSize: '0.95rem', 
                            height: 32,
                            backgroundColor: '#1e3c72',
                            fontWeight: 500,
                            '& .MuiChip-label': {
                                px: 2
                            }
                        }}
                />
            </Box>
            
            <Grid container spacing={3}>
                    {currentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </Grid>

                {/* Pagination */}
                {properties.length > itemsPerPage && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        mt: 6,
                        mb: 4
                    }}>
                        <Stack spacing={2}>
                            <Pagination 
                                count={Math.ceil(properties.length / itemsPerPage)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontSize: '1rem',
                                        minWidth: 40,
                                        height: 40,
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#1e3c72 !important',
                                        color: 'white',
                                    }
                                }}
                            />
                        </Stack>
                    </Box>
                )}

            {properties.length === 0 && (
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        mt: 8,
                        p: 6,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 4,
                        border: '1px dashed',
                            borderColor: 'divider',
                            backdropFilter: 'blur(8px)'
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Aramanıza uygun ilan bulunamadı
                    </Typography>
                    <Typography color="text.secondary">
                        Lütfen farklı filtreleme seçeneklerini deneyin
                    </Typography>
                </Box>
            )}
                </Box>
        </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default HomePage; 