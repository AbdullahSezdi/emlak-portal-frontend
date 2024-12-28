import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import {
    Landscape as LandscapeIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    LocationCity as LocationCityIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Home as HomeIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { propertyApi } from '../services/api';
import DialogContentText from '@mui/material/DialogContentText';

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

interface PropertyForm {
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
    images: (File | string)[];
}

interface Stats {
    totalProperties: number;
    totalValue: string;
    dailyVisitors: number;
    activeCities: number;
}

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalProperties: 0,
        totalValue: '0',
        dailyVisitors: 0,
        activeCities: 0
    });
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newProperty, setNewProperty] = useState<PropertyForm>({
        _id: '',
        title: '',
        description: '',
        price: 0,
        area: 0,
        location: {
            city: '',
            district: '',
            address: ''
        },
        features: {
            zoning: ''
        },
        images: []
    });
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState<string[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingProperty, setEditingProperty] = useState<PropertyForm>({
        _id: '',
        title: '',
        description: '',
        price: 0,
        area: 0,
        location: {
            city: '',
            district: '',
            address: ''
        },
        features: {
            zoning: ''
        },
        images: []
    });

    const cities = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
        'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
        'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
        'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
        'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
        'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
        'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
        'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
    ];

    const cityDistricts: { [key: string]: string[] } = {
        'Adana': ['Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'],
        'Adıyaman': ['Merkez', 'Besni', 'Çelikhan', 'Gerger', 'Gölbaşı', 'Kahta', 'Samsat', 'Sincik', 'Tut'],
        'Afyonkarahisar': ['Merkez', 'Başmakçı', 'Bayat', 'Bolvadin', 'Çay', 'Çobanlar', 'Dazkırı', 'Dinar', 'Emirdağ', 'Evciler', 'Hocalar', 'İhsaniye', 'İscehisar', 'Kızılören', 'Sandıklı', 'Sinanpaşa', 'Sultandağı', 'Şuhut'],
        'Ağrı': ['Merkez', 'Diyadin', 'Doğubayazıt', 'Eleşkirt', 'Hamur', 'Patnos', 'Taşlıçay', 'Tutak'],
        'Amasya': ['Merkez', 'Göynücek', 'Gümüşhacıköy', 'Hamamözü', 'Merzifon', 'Suluova', 'Taşova'],
        'Ankara': ['Akyurt', 'Altındağ', 'Ayaş', 'Balâ', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kazan', 'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'],
        'Antalya': ['Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik'],
        'Artvin': ['Merkez', 'Ardanuç', 'Arhavi', 'Borçka', 'Hopa', 'Murgul', 'Şavşat', 'Yusufeli'],
        'Aydın': ['Bozdoğan', 'Buharkent', 'Çine', 'Didim', 'Efeler', 'Germencik', 'İncirliova', 'Karacasu', 'Karpuzlu', 'Koçarlı', 'Köşk', 'Kuşadası', 'Kuyucak', 'Nazilli', 'Söke', 'Sultanhisar', 'Yenipazar'],
        'Balıkesir': ['Altıeylül', 'Ayvalık', 'Balya', 'Bandırma', 'Bigadiç', 'Burhaniye', 'Dursunbey', 'Edremit', 'Erdek', 'Gömeç', 'Gönen', 'Havran', 'İvrindi', 'Karesi', 'Kepsut', 'Manyas', 'Marmara', 'Savaştepe', 'Sındırgı', 'Susurluk'],
        'Bilecik': ['Merkez', 'Bozüyük', 'Gölpazarı', 'İnhisar', 'Osmaneli', 'Pazaryeri', 'Söğüt', 'Yenipazar'],
        'Bingöl': ['Merkez', 'Adaklı', 'Genç', 'Karlıova', 'Kiğı', 'Solhan', 'Yayladere', 'Yedisu'],
        'Bitlis': ['Merkez', 'Adilcevaz', 'Ahlat', 'Güroymak', 'Hizan', 'Mutki', 'Tatvan'],
        'Bolu': ['Merkez', 'Dörtdivan', 'Gerede', 'Göynük', 'Kıbrıscık', 'Mengen', 'Mudurnu', 'Seben', 'Yeniçağa'],
        'Burdur': ['Merkez', 'Ağlasun', 'Altınyayla', 'Bucak', 'Çavdır', 'Çeltikçi', 'Gölhisar', 'Karamanlı', 'Kemer', 'Tefenni', 'Yeşilova'],
        'Bursa': ['Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
        'Çanakkale': ['Merkez', 'Ayvacık', 'Bayramiç', 'Biga', 'Bozcaada', 'Çan', 'Eceabat', 'Ezine', 'Gelibolu', 'Gökçeada', 'Lapseki', 'Yenice'],
        'Çankırı': ['Merkez', 'Atkaracalar', 'Bayramören', 'Çerkeş', 'Eldivan', 'Ilgaz', 'Kızılırmak', 'Korgun', 'Kurşunlu', 'Orta', 'Şabanözü', 'Yapraklı'],
        'Çorum': ['Merkez', 'Alaca', 'Bayat', 'Boğazkale', 'Dodurga', 'İskilip', 'Kargı', 'Laçin', 'Mecitözü', 'Oğuzlar', 'Ortaköy', 'Osmancık', 'Sungurlu', 'Uğurludağ'],
        'Denizli': ['Acıpayam', 'Babadağ', 'Baklan', 'Bekilli', 'Beyağaç', 'Bozkurt', 'Buldan', 'Çal', 'Çameli', 'Çardak', 'Çivril', 'Güney', 'Honaz', 'Kale', 'Merkezefendi', 'Pamukkale', 'Sarayköy', 'Serinhisar', 'Tavas'],
        'Diyarbakır': ['Bağlar', 'Bismil', 'Çermik', 'Çınar', 'Çüngüş', 'Dicle', 'Eğil', 'Ergani', 'Hani', 'Hazro', 'Kayapınar', 'Kocaköy', 'Kulp', 'Lice', 'Silvan', 'Sur', 'Yenişehir'],
        'Edirne': ['Merkez', 'Enez', 'Havsa', 'İpsala', 'Keşan', 'Lalapaşa', 'Meriç', 'Süloğlu', 'Uzunköprü'],
        'Elazığ': ['Merkez', 'Ağın', 'Alacakaya', 'Arıcak', 'Baskil', 'Karakoçan', 'Keban', 'Kovancılar', 'Maden', 'Palu', 'Sivrice'],
        'Erzincan': ['Merkez', 'Çayırlı', 'İliç', 'Kemah', 'Kemaliye', 'Otlukbeli', 'Refahiye', 'Tercan', 'Üzümlü'],
        'Erzurum': ['Aşkale', 'Aziziye', 'Çat', 'Hınıs', 'Horasan', 'İspir', 'Karaçoban', 'Karayazı', 'Köprüköy', 'Narman', 'Oltu', 'Olur', 'Palandöken', 'Pasinler', 'Pazaryolu', 'Şenkaya', 'Tekman', 'Tortum', 'Uzundere', 'Yakutiye'],
        'Eskişehir': ['Alpu', 'Beylikova', 'Çifteler', 'Günyüzü', 'Han', 'İnönü', 'Mahmudiye', 'Mihalgazi', 'Mihalıççık', 'Odunpazarı', 'Sarıcakaya', 'Seyitgazi', 'Sivrihisar', 'Tepebaşı'],
        'Gaziantep': ['Araban', 'İslahiye', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey', 'Şehitkamil', 'Yavuzeli'],
        'Giresun': ['Merkez', 'Alucra', 'Bulancak', 'Çamoluk', 'Çanakçı', 'Dereli', 'Doğankent', 'Espiye', 'Eynesil', 'Görele', 'Güce', 'Keşap', 'Piraziz', 'Şebinkarahisar', 'Tirebolu', 'Yağlıdere'],
        'Gümüşhane': ['Merkez', 'Kelkit', 'Köse', 'Kürtün', 'Şiran', 'Torul'],
        'Hakkari': ['Merkez', 'Çukurca', 'Şemdinli', 'Yüksekova'],
        'Hatay': ['Altınözü', 'Antakya', 'Arsuz', 'Belen', 'Defne', 'Dörtyol', 'Erzin', 'Hassa', 'İskenderun', 'Kırıkhan', 'Kumlu', 'Payas', 'Reyhanlı', 'Samandağ', 'Yayladağı'],
        'Isparta': ['Merkez', 'Aksu', 'Atabey', 'Eğirdir', 'Gelendost', 'Gönen', 'Keçiborlu', 'Senirkent', 'Sütçüler', 'Şarkikaraağaç', 'Uluborlu', 'Yalvaç', 'Yenişarbademli'],
        'Mersin': ['Akdeniz', 'Anamur', 'Aydıncık', 'Bozyazı', 'Çamlıyayla', 'Erdemli', 'Gülnar', 'Mezitli', 'Mut', 'Silifke', 'Tarsus', 'Toroslar', 'Yenişehir'],
        'İstanbul': ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüp', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
        'İzmir': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
        'Kars': ['Merkez', 'Akyaka', 'Arpaçay', 'Digor', 'Kağızman', 'Sarıkamış', 'Selim', 'Susuz'],
        'Kastamonu': ['Merkez', 'Abana', 'Ağlı', 'Araç', 'Azdavay', 'Bozkurt', 'Cide', 'Çatalzeytin', 'Daday', 'Devrekani', 'Doğanyurt', 'Hanönü', 'İhsangazi', 'İnebolu', 'Küre', 'Pınarbaşı', 'Seydiler', 'Şenpazar', 'Taşköprü', 'Tosya'],
        'Kayseri': ['Akkışla', 'Bünyan', 'Develi', 'Felahiye', 'Hacılar', 'İncesu', 'Kocasinan', 'Melikgazi', 'Özvatan', 'Pınarbaşı', 'Sarıoğlan', 'Sarız', 'Talas', 'Tomarza', 'Yahyalı', 'Yeşilhisar'],
        'Kırklareli': ['Merkez', 'Babaeski', 'Demirköy', 'Kofçaz', 'Lüleburgaz', 'Pehlivanköy', 'Pınarhisar', 'Vize'],
        'Kırşehir': ['Merkez', 'Akçakent', 'Akpınar', 'Boztepe', 'Çiçekdağı', 'Kaman', 'Mucur'],
        'Kocaeli': ['Başiskele', 'Çayırova', 'Darıca', 'Derince', 'Dilovası', 'Gebze', 'Gölcük', 'İzmit', 'Kandıra', 'Karamürsel', 'Kartepe', 'Körfez'],
        'Konya': ['Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Çeltik', 'Cihanbeyli', 'Çumra', 'Derbent', 'Derebucak', 'Doğanhisar', 'Emirgazi', 'Ereğli', 'Güneysınır', 'Hadim', 'Halkapınar', 'Hüyük', 'Ilgın', 'Kadınhanı', 'Karapınar', 'Karatay', 'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent', 'Tuzlukçu', 'Yalıhüyük', 'Yunak'],
        'Kütahya': ['Merkez', 'Altıntaş', 'Aslanapa', 'Çavdarhisar', 'Domaniç', 'Dumlupınar', 'Emet', 'Gediz', 'Hisarcık', 'Pazarlar', 'Şaphane', 'Simav', 'Tavşanlı'],
        'Malatya': ['Akçadağ', 'Arapgir', 'Arguvan', 'Battalgazi', 'Darende', 'Doğanşehir', 'Doğanyol', 'Hekimhan', 'Kale', 'Kuluncak', 'Pütürge', 'Yazıhan', 'Yeşilyurt'],
        'Manisa': ['Ahmetli', 'Akhisar', 'Alaşehir', 'Demirci', 'Gölmarmara', 'Gördes', 'Kırkağaç', 'Köprübaşı', 'Kula', 'Salihli', 'Sarıgöl', 'Saruhanlı', 'Selendi', 'Soma', 'Şehzadeler', 'Turgutlu', 'Yunusemre'],
        'Kahramanmaraş': ['Afşin', 'Andırın', 'Çağlayancerit', 'Dulkadiroğlu', 'Ekinözü', 'Elbistan', 'Göksun', 'Nurhak', 'Onikişubat', 'Pazarcık', 'Türkoğlu'],
        'Mardin': ['Artuklu', 'Dargeçit', 'Derik', 'Kızıltepe', 'Mazıdağı', 'Midyat', 'Nusaybin', 'Ömerli', 'Savur', 'Yeşilli'],
        'Muğla': ['Bodrum', 'Dalaman', 'Datça', 'Fethiye', 'Kavaklıdere', 'Köyceğiz', 'Marmaris', 'Menteşe', 'Milas', 'Ortaca', 'Seydikemer', 'Ula', 'Yatağan'],
        'Muş': ['Merkez', 'Bulanık', 'Hasköy', 'Korkut', 'Malazgirt', 'Varto'],
        'Nevşehir': ['Merkez', 'Acıgöl', 'Avanos', 'Derinkuyu', 'Gülşehir', 'Hacıbektaş', 'Kozaklı', 'Ürgüp'],
        'Niğde': ['Merkez', 'Altunhisar', 'Bor', 'Çamardı', 'Çiftlik', 'Ulukışla'],
        'Ordu': ['Akkuş', 'Altınordu', 'Aybastı', 'Çamaş', 'Çatalpınar', 'Çaybaşı', 'Fatsa', 'Gölköy', 'Gülyalı', 'Gürgentepe', 'İkizce', 'Kabadüz', 'Kabataş', 'Korgan', 'Kumru', 'Mesudiye', 'Perşembe', 'Ulubey', 'Ünye'],
        'Rize': ['Merkez', 'Ardeşen', 'Çamlıhemşin', 'Çayeli', 'Derepazarı', 'Fındıklı', 'Güneysu', 'Hemşin', 'İkizdere', 'İyidere', 'Kalkandere', 'Pazar'],
        'Sakarya': ['Adapazarı', 'Akyazı', 'Arifiye', 'Erenler', 'Ferizli', 'Geyve', 'Hendek', 'Karapürçek', 'Karasu', 'Kaynarca', 'Kocaali', 'Pamukova', 'Sapanca', 'Serdivan', 'Söğütlü', 'Taraklı'],
        'Samsun': ['Alaçam', 'Asarcık', 'Atakum', 'Ayvacık', 'Bafra', 'Canik', 'Çarşamba', 'Havza', 'İlkadım', 'Kavak', 'Ladik', 'Ondokuzmayıs', 'Salıpazarı', 'Tekkeköy', 'Terme', 'Vezirköprü', 'Yakakent'],
        'Siirt': ['Merkez', 'Baykan', 'Eruh', 'Kurtalan', 'Pervari', 'Şirvan', 'Tillo'],
        'Sinop': ['Merkez', 'Ayancık', 'Boyabat', 'Dikmen', 'Durağan', 'Erfelek', 'Gerze', 'Saraydüzü', 'Türkeli'],
        'Sivas': ['Merkez', 'Akıncılar', 'Altınyayla', 'Divriği', 'Doğanşar', 'Gemerek', 'Gölova', 'Gürün', 'Hafik', 'İmranlı', 'Kangal', 'Koyulhisar', 'Suşehri', 'Şarkışla', 'Ulaş', 'Yıldızeli', 'Zara'],
        'Tekirdağ': ['Çerkezköy', 'Çorlu', 'Ergene', 'Hayrabolu', 'Kapaklı', 'Malkara', 'Marmaraereğlisi', 'Muratlı', 'Saray', 'Süleymanpaşa', 'Şarköy'],
        'Tokat': ['Merkez', 'Almus', 'Artova', 'Başçiftlik', 'Erbaa', 'Niksar', 'Pazar', 'Reşadiye', 'Sulusaray', 'Turhal', 'Yeşilyurt', 'Zile'],
        'Trabzon': ['Akçaabat', 'Araklı', 'Arsin', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara', 'Dernekpazarı', 'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Of', 'Ortahisar', 'Sürmene', 'Şalpazarı', 'Tonya', 'Vakfıkebir', 'Yomra'],
        'Tunceli': ['Merkez', 'Çemişgezek', 'Hozat', 'Mazgirt', 'Nazımiye', 'Ovacık', 'Pertek', 'Pülümür'],
        'Şanlıurfa': ['Akçakale', 'Birecik', 'Bozova', 'Ceylanpınar', 'Eyyübiye', 'Halfeti', 'Haliliye', 'Harran', 'Hilvan', 'Karaköprü', 'Siverek', 'Suruç', 'Viranşehir'],
        'Uşak': ['Merkez', 'Banaz', 'Eşme', 'Karahallı', 'Sivaslı', 'Ulubey'],
        'Van': ['Bahçesaray', 'Başkale', 'Çaldıran', 'Çatak', 'Edremit', 'Erciş', 'Gevaş', 'Gürpınar', 'İpekyolu', 'Muradiye', 'Özalp', 'Saray', 'Tuşba'],
        'Yozgat': ['Merkez', 'Akdağmadeni', 'Aydıncık', 'Boğazlıyan', 'Çandır', 'Çayıralan', 'Çekerek', 'Kadışehri', 'Saraykent', 'Sarıkaya', 'Sorgun', 'Şefaatli', 'Yenifakılı', 'Yerköy'],
        'Zonguldak': ['Merkez', 'Alaplı', 'Çaycuma', 'Devrek', 'Gökçebey', 'Kilimli', 'Kozlu'],
        'Aksaray': ['Merkez', 'Ağaçören', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Ortaköy', 'Sarıyahşi'],
        'Bayburt': ['Merkez', 'Aydıntepe', 'Demirözü'],
        'Karaman': ['Merkez', 'Ayrancı', 'Başyayla', 'Ermenek', 'Kazımkarabekir', 'Sarıveliler'],
        'Kırıkkale': ['Merkez', 'Bahşili', 'Balışeyh', 'Çelebi', 'Delice', 'Karakeçili', 'Keskin', 'Sulakyurt', 'Yahşihan'],
        'Batman': ['Merkez', 'Beşiri', 'Gercüş', 'Hasankeyf', 'Kozluk', 'Sason'],
        'Şırnak': ['Merkez', 'Beytüşşebap', 'Cizre', 'Güçlükonak', 'İdil', 'Silopi', 'Uludere'],
        'Bartın': ['Merkez', 'Amasra', 'Kurucaşile', 'Ulus'],
        'Ardahan': ['Merkez', 'Çıldır', 'Damal', 'Göle', 'Hanak', 'Posof'],
        'Iğdır': ['Merkez', 'Aralık', 'Karakoyunlu', 'Tuzluca'],
        'Yalova': ['Merkez', 'Altınova', 'Armutlu', 'Çınarcık', 'Çiftlikköy', 'Termal'],
        'Karabük': ['Merkez', 'Eflani', 'Eskipazar', 'Ovacık', 'Safranbolu', 'Yenice'],
        'Kilis': ['Merkez', 'Elbeyli', 'Musabeyli', 'Polateli'],
        'Osmaniye': ['Merkez', 'Bahçe', 'Düziçi', 'Hasanbeyli', 'Kadirli', 'Sumbas', 'Toprakkale'],
        'Düzce': ['Merkez', 'Akçakoca', 'Cumayeri', 'Çilimli', 'Gölyaka', 'Gümüşova', 'Kaynaşlı', 'Yığılca']
    };

    useEffect(() => {
        if (selectedCity && cityDistricts[selectedCity]) {
            setDistricts(cityDistricts[selectedCity]);
            setNewProperty(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: selectedCity,
                    district: ''
                }
            }));
        }
    }, [selectedCity]);

    useEffect(() => {
        const calculateStats = () => {
            const totalProps = properties.length;
            // Toplam değeri hesapla (TL cinsinden)
            const totalValue = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
            // Toplam değeri milyon TL'ye çevir ve 2 ondalık basamakla formatla
            const formattedTotalValue = (totalValue / 1000000).toFixed(2);
            
            // Benzersiz şehirleri hesapla
            const uniqueCities = Array.from(new Set(properties.map(p => p.location.city)));
            
            setStats({
                totalProperties: totalProps,
                totalValue: formattedTotalValue,
                dailyVisitors: 150, // Örnek değer
                activeCities: uniqueCities.length
            });
        };

        calculateStats();
    }, [properties]);

    useEffect(() => {
        fetchDashboardStats();
        fetchProperties();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await propertyApi.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await propertyApi.getAllProperties();
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setNewProperty(prev => ({
                        ...prev,
                location: {
                    ...prev.location,
                    [field]: value
                }
            }));
        } else if (name.startsWith('features.')) {
            const field = name.split('.')[1];
            setNewProperty(prev => ({
                ...prev,
                features: {
                    ...prev.features,
                    [field]: value
                }
            }));
        } else {
            setNewProperty(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const totalImages = [...newProperty.images, ...files];
            
            if (totalImages.length > 10) {
                alert('En fazla 10 resim yükleyebilirsiniz.');
                return;
            }
            
            setNewProperty(prev => ({
                ...prev,
                images: totalImages
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setNewProperty(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const propertyData = {
                title: newProperty.title,
                description: newProperty.description,
                price: Number(newProperty.price),
                area: Number(newProperty.area),
                location: {
                    city: selectedCity,
                    district: newProperty.location.district,
                    address: newProperty.location.address
                },
                features: newProperty.features
            };

            // Property verilerini JSON olarak ekle
            formData.append('data', JSON.stringify(propertyData));
            
            // Resimleri ekle
            newProperty.images.forEach((image) => {
                formData.append('images', image);
            });

            await propertyApi.createProperty(formData);
            setOpenAddDialog(false);
            await fetchProperties(); // Listeyi yenile
            
            // Formu temizle
            setNewProperty({
                _id: '',
                title: '',
                description: '',
                price: 0,
                area: 0,
                location: { city: '', district: '', address: '' },
                features: { zoning: '' },
                images: []
            });
            setSelectedCity(''); // Şehir seçimini sıfırla
            setDistricts([]); // İlçe listesini sıfırla
            
            // Ana sayfaya yönlendir
            navigate('/');
        } catch (error) {
            console.error('Error creating property:', error);
            alert('Arsa eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleCityChange = (event: SelectChangeEvent<string>) => {
        const city = event.target.value;
        setSelectedCity(city);
        if (city && cityDistricts[city]) {
            setDistricts(cityDistricts[city]);
            setNewProperty(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: city,
                    district: ''
                }
            }));
        } else {
            setDistricts([]);
        }
    };

    const handleDeleteClick = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await propertyApi.deleteProperty(selectedPropertyId);
            await fetchProperties(); // Listeyi yenile
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Arsa silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleEditClick = (property: any) => {
        setSelectedPropertyId(property._id);
        setEditingProperty({
            _id: property._id,
            title: property.title,
            description: property.description,
            price: property.price,
            area: property.area,
            location: {
                city: property.location.city,
                district: property.location.district,
                address: property.location.address
            },
            features: {
                zoning: property.features.zoning
            },
            images: []
        });
        setSelectedCity(property.location.city);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async () => {
        try {
            const formData = new FormData();
            const propertyData = {
                title: editingProperty.title,
                description: editingProperty.description,
                price: Number(editingProperty.price),
                area: Number(editingProperty.area),
                location: {
                    city: selectedCity,
                    district: editingProperty.location.district,
                    address: editingProperty.location.address
                },
                features: editingProperty.features
            };

            formData.append('data', JSON.stringify(propertyData));
            
            editingProperty.images.forEach((image) => {
                formData.append('images', image);
            });

            await propertyApi.updateProperty(selectedPropertyId, formData);
            setOpenEditDialog(false);
            await fetchProperties(); // Listeyi yenile
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Arsa güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
        <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)'
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );

    const zoningOptions = [
        'Konut İmarlı',
        'Ticari İmarlı',
        'Sanayi İmarlı',
        'Karma İmarlı',
        'Turizm İmarlı',
        'Tarım Arazisi',
        'İmarsız',
    ];

    // Resim önizleme için URL oluşturma
    const getImagePreviewUrl = (image: File | string) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return image;
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4 
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Ana Sayfaya Dön
                </Button>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={LandscapeIcon}
                        title="Toplam Arsa"
                        value={stats.totalProperties}
                        subtitle="Güncel Veri"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={TrendingUpIcon}
                        title="Toplam Değer"
                        value={`${stats.totalValue}M TL`}
                        subtitle="Toplam Portföy Değeri"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={PeopleIcon}
                        title="Günlük Ziyaretçi"
                        value={stats.dailyVisitors}
                        subtitle="Bugün"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={LocationCityIcon}
                        title="Aktif Şehir"
                        value={stats.activeCities}
                        subtitle="Güncel Veri"
                    />
                </Grid>
            </Grid>

            <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
            }}>
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Son Eklenen Arsalar
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Yeni Arsa Ekle
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Başlık</TableCell>
                                <TableCell>Konum</TableCell>
                                <TableCell align="right">Fiyat</TableCell>
                                <TableCell align="right">Alan</TableCell>
                                <TableCell>İmar Durumu</TableCell>
                                <TableCell align="center">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {properties.map((property: any) => (
                                <TableRow key={property._id} hover>
                                    <TableCell>{property.title}</TableCell>
                                    <TableCell>
                                        {property.location.city}, {property.location.district}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        }).format(property.price)}
                                    </TableCell>
                                    <TableCell align="right">{property.area} m²</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: 'inline-block',
                                                px: 2,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: 'rgba(0, 128, 0, 0.1)',
                                                color: 'green'
                                            }}
                                        >
                                            {property.features?.zoning || 'Belirtilmemiş'}
            </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Düzenle">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => handleEditClick(property)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sil">
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDeleteClick(property._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog 
                open={openAddDialog} 
                onClose={() => setOpenAddDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Yeni Arsa Ekle</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Başlık"
                                name="title"
                                value={newProperty.title}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Açıklama"
                                name="description"
                                multiline
                                rows={4}
                                value={newProperty.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fiyat"
                                name="price"
                                type="number"
                                value={newProperty.price}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: <Typography component="span">TL</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Alan"
                                name="area"
                                type="number"
                                value={newProperty.area}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: <Typography component="span">m²</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Şehir</InputLabel>
                                <Select
                                    value={selectedCity}
                                    label="Şehir"
                                    onChange={handleCityChange}
                                >
                                    {cities.map((city) => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>İlçe</InputLabel>
                                <Select
                                    value={newProperty.location.district}
                                    label="İlçe"
                                    onChange={(event: SelectChangeEvent<string>) => {
                                        const district = event.target.value;
                                        setNewProperty(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                district: district
                                            }
                                        }));
                                    }}
                                    disabled={!selectedCity}
                                >
                                    {districts.map((district) => (
                                        <MenuItem key={district} value={district}>
                                            {district}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Adres"
                                name="location.address"
                                value={newProperty.location.address}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>İmar Durumu</InputLabel>
                                <Select
                                    value={newProperty.features.zoning}
                                    label="İmar Durumu"
                                    onChange={(e) => setNewProperty({
                                        ...newProperty,
                                        features: {
                                            ...newProperty.features,
                                            zoning: e.target.value
                                        }
                                    })}
                                >
                                    {zoningOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 1 }}
                            >
                                Resim Yükle (Maks. 10)
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {newProperty.images.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {newProperty.images.length} resim seçildi
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {newProperty.images.map((image, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 1,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={getImagePreviewUrl(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                        }
                                                    }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>İptal</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Arsayı Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bu arsayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>İptal</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={openEditDialog} 
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Arsa Düzenle</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Başlık"
                                name="title"
                                value={editingProperty.title}
                                onChange={(e) => setEditingProperty({
                                    ...editingProperty,
                                    title: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Açıklama"
                                multiline
                                rows={4}
                                value={editingProperty.description}
                                onChange={(e) => setEditingProperty({
                                    ...editingProperty,
                                    description: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fiyat"
                                name="price"
                                type="number"
                                value={editingProperty.price}
                                onChange={(e) => setEditingProperty({
                                    ...editingProperty,
                                    price: Number(e.target.value)
                                })}
                                InputProps={{
                                    endAdornment: <Typography component="span">TL</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Alan (m²)"
                                name="area"
                                type="number"
                                value={editingProperty.area}
                                onChange={(e) => setEditingProperty({
                                    ...editingProperty,
                                    area: Number(e.target.value)
                                })}
                                InputProps={{
                                    endAdornment: <Typography component="span">m²</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Şehir</InputLabel>
                                <Select
                                    value={selectedCity}
                                    label="Şehir"
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    {Object.keys(cityDistricts).map((city) => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>İlçe</InputLabel>
                                <Select
                                    value={editingProperty.location.district}
                                    label="İlçe"
                                    onChange={(e) => setEditingProperty({
                                        ...editingProperty,
                                        location: {
                                            ...editingProperty.location,
                                            district: e.target.value
                                        }
                                    })}
                                >
                                    {selectedCity && cityDistricts[selectedCity]?.map((district) => (
                                        <MenuItem key={district} value={district}>
                                            {district}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Adres"
                                name="location.address"
                                value={editingProperty.location.address}
                                onChange={(e) => setEditingProperty({
                                    ...editingProperty,
                                    location: {
                                        ...editingProperty.location,
                                        address: e.target.value
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>İmar Durumu</InputLabel>
                                <Select
                                    value={editingProperty.features?.zoning || ''}
                                    label="İmar Durumu"
                                    onChange={(e) => setEditingProperty({
                                        ...editingProperty,
                                        features: {
                                            ...editingProperty.features,
                                            zoning: e.target.value
                                        }
                                    })}
                                >
                                    {zoningOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 1 }}
                            >
                                Resim Yükle (Maks. 10)
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const files = Array.from(e.target.files);
                                            setEditingProperty(prev => ({
                                                ...prev,
                                                images: files
                                            }));
                                        }
                                    }}
                                />
                                </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>İptal</Button>
                    <Button onClick={handleEditSubmit} variant="contained">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPanel; 