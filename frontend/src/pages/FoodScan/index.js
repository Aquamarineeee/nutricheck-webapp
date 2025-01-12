import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import '../../styles/scan.module.css';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Nutrients from './Nutrients';
import { Box, Container, Divider } from '@mui/material';
import { API } from '../../services/apis';
import { useSnackbar } from 'notistack';
import { FullPageLoading } from '../../Components/LoadingSpinner';

const UNITS = ['gam', 'ounce', 'ml', 'miếng', 'lát', 'cốc', 'thìa canh'];

const ScannedImg = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedItems, setselectedItems] = useState([]);
    const [screen, setscreen] = useState(false);
    const [image, setimage] = useState('');
    const [imageBlob, setimageBlob] = useState('');
    const [foodItems, setfoodItems] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [nutrientsList, setnutrientsList] = useState([]);
    const [consumed_food_id, setconsumed_food_id] = useState('');
    const handleSelectImage = async (foodImage) => {
        try {
            const res = await API.captureFood({ foodImage });
            setimage(res.image_url);
            setimageBlob(URL.createObjectURL(foodImage));
            setfoodItems(res.foodItems);
        } catch (err) {
            if (err?.response?.data?.msg)
                enqueueSnackbar(err.response.data.msg, {
                    variant: 'error',
                });
            else
                enqueueSnackbar('Đã có lỗi xảy ra. Try again', {
                    variant: 'error',
                });
        }
    };

    // const handleSelectItem = (foodItem) => {
    //     if (selectedItems.find((item) => item.id === foodItem.id)) {
    //         setselectedItems(
    //             selectedItems.filter((item) => item.id !== foodItem.id)
    //         );
    //     } else {
    //         if (selectedItems.length === 3) {
    //             enqueueSnackbar('Chỉ lựa chọn 3 thành phần', { variant: 'error' });
    //             return;
    //         }

    //         setselectedItems([
    //             ...selectedItems,
    //             { ...foodItem, qty: 50, unit: 'gm' },
    //         ]);
    //     }
    // };
    const foodStandardQuantities = {
        "acorn squash": 100,
        "almond": 28,
        "amaranth": 100,
        "anchovy": 25,
        "antipasto": 100,
        "apple": 150,
        "apple pie": 200,
        "apple sauce": 125,
        "apricot": 60,
        "artichoke": 100,
        "arugula": 40,
        "asparagus": 100,
        "aspic": 80,
        "avocado": 150,
        "baby back ribs": 200,
        "bacon": 30,
        "bagel": 100,
        "baguette": 150,
        "baked alaska": 250,
        "baklava": 80,
        "bamboo shoots": 100,
        "banana": 120,
        "barley": 100,
        "basil": 20,
        "bass": 150,
        "bay leaf": 1,
        "beancurd": 100,
        "beans": 100,
        "beef": 150,
        "beef carpaccio": 100,
        "beef steak": 200,
        "beef tartare": 100,
        "beet": 100,
        "beet salad": 150,
        "beignets": 50,
        "bell pepper": 80,
        "berry": 50,
        "bibimbap": 300,
        "bilberry": 50,
        "birthday cake": 200,
        "biscuits": 30,
        "bitter melon": 100,
        "black beans": 100,
        "black currant": 50,
        "blackberry": 60,
        "blood orange": 100,
        "blood sausage": 100,
        "blue cheese": 30,
        "blueberry": 50,
        "blueberry pie": 200,
        "bok choy": 100,
        "bonbon": 20,
        "boysenberry": 60,
        "bread": 60,
        "bread pudding": 150,
        "bread rolls": 40,
        "breadfruit": 100,
        "breadstick": 25,
        "bream": 150,
        "brie": 30,
        "brioche": 100,
        "brisket": 200,
        "brittle": 40,
        "broad beans": 100,
        "broccoli": 100,
        "broccolini": 100,
        "brown rice": 100,
        "brownie": 50,
        "brulee": 100,
        "bruschetta": 80,
        "brussels sprout": 100,
        "buckwheat": 100,
        "burrito": 250,
        "butter": 30,
        "cabbage": 100,
        "caesar salad": 150,
        "cake": 200,
        "cake pop": 50,
        "calamari": 100,
        "camembert": 30,
        "canape": 50,
        "candy": 20,
        "candy apple": 150,
        "candy bar": 50,
        "cannoli": 80,
        "cantaloupe": 150,
        "caper": 10,
        "caprese salad": 150,
        "caramel apple": 150,
        "cardoon": 100,
        "carp": 150,
        "carpaccio": 100,
        "carrot": 100,
        "carrot cake": 150,
        "cashew": 28,
        "cassava": 100,
        "casserole": 200,
        "cauliflower": 100,
        "caviar": 30,
        "celery": 100,
        "cereal": 50,
        "ceviche": 150,
        "chard": 100,
        "cheddar": 30,
        "cheese": 30,
        "cheeseburger": 150,
        "cheesecake": 150,
        "cherry": 80,
        "cherry tomato": 50,
        "chestnut": 50,
        "chicken": 200,
        "chicken breast": 150,
        "chicken curry": 200,
        "chicken leg": 180,
        "chicken wings": 150,
        "chickpeas": 100,
        "chili": 100,
        "chili pepper": 20,
        "chips": 40,
        "chives": 10,
        "chocolate": 30,
        "chorizo": 50,
        "chowder": 200,
        "churros": 60,
        "chutney": 50,
        "ciabatta": 100,
        "cinnamon roll": 80,
        "citron": 30,
        "citrus": 100,
        "clam": 100,
        "clam chowder": 200,
        "clementine": 100,
        "cobbler": 200,
        "cockle": 80,
        "coconut": 60,
        "coleslaw": 150,
        "collards": 100,
        "common bean": 100,
        "compote": 100,
        "cookie": 30,
        "corn": 100,
        "corn bread": 100,
        "corn salad": 150,
        "corned beef": 150,
        "cornflakes": 50,
        "cottage cheese": 100,
        "couscous": 100,
        "crab": 100,
        "crab cakes": 150,
        "cracker": 20,
        "cranberry": 50,
        "crayfish": 100,
        "creme brulee": 100,
        "crepe": 100,
        "crescent roll": 30,
        "cress": 20,
        "crispbread": 30,
        "croissant": 60,
        "croque madame": 150,
        "croquette": 50,
        "crouton": 10,
        "crunch": 40,
        "cucumber": 100,
        "cupcake": 60,
        "curd": 50,
        "currant": 50,
        "custard": 100,
        "cuttlefish": 100,
        "daikon": 100,
        "dandelion greens": 100,
        "danish pastry": 80,
        "date": 50,
        "deviled eggs": 50,
        "dough": 100,
        "doughnut": 60,
        "dragonfruit": 150,
        "dried apricot": 40,
        "dried fruit": 50,
        "drumstick": 180,
        "duck": 200,
        "dumpling": 60,
        "durian": 150,
        "eclair": 60,
        "edamame": 100,
        "eel": 100,
        "egg": 50,
        "egg white": 30,
        "egg yolk": 20,
        "eggplant": 100,
        "elderberry": 50,
        "endive": 100,
        "english muffin": 60,
        "escargots": 80,
        "falafel": 50,
        "farfalle": 100,
        "fava beans": 100,
        "fiddlehead": 100,
        "fig": 50,
        "filet mignon": 200,
        "fillet of sole": 150,
        "fish": 150,
        "fish and chips": 250,
        "flan": 100,
        "flatbread": 100,
        "flatfish": 150,
        "florence fennel": 100,
        "focaccia": 100,
        "foie gras": 50,
        "fondue": 100,
        "frankfurters": 50,
        "french beans": 100,
        "french bread": 100,
        "french fries": 150,
        "french onion soup": 200,
        "french toast": 100,
        "fried calamari": 100,
        "fried egg": 50,
        "fried rice": 200,
        "frittata": 100,
        "fritter": 80,
        "frozen yogurt": 150,
        "fruit salad": 150,
        "fruitcake": 200,
        "fudge": 40,
        "fusilli": 100,
        "galette": 150,
        "garlic": 20,
        "garlic bread": 60,
        "garlic chives": 10,
        "gazpacho": 150,
        "gherkin": 20,
        "ginger": 20,
        "gnocchi": 100,
        "goats cheese": 30,
        "goji berry": 50,
        "goose": 200,
        "gooseberry": 50,
        "gorgonzola": 30,
        "gouda": 30,
        "goulash": 200,
        "gourd": 100,
        "granola": 50,
        "grape": 100,
        "grapefruit": 100,
        "greek salad": 150,
        "green bean": 100,
        "green onion": 20,
        "grilled cheese sandwich": 150,
        "grits": 100,
        "ground beef": 150,
        "guacamole": 100,
        "guava": 150,
        "gyoza": 60,
        "gyro": 150,
        "habanero pepper": 10,
        "halibut": 150,
        "ham": 150,
        "hamburger": 200,
        "hash": 100,
        "hazelnut": 28,
        "herring": 100,
        "honey": 30,
        "honeydew melon": 150,
        "hot dog": 120,
        "huckleberry": 50,
        "huevos rancheros": 200,
        "hummus": 100,
        "ice cream": 150,
        "iceberg lettuce": 100,
        "jackfruit": 200,
        "jalapeno": 10,
        "jelly beans": 20,
        "jerusalem artichoke": 100,
        "jicama": 100,
        "jordan almonds": 20,
        "jujube": 50,
        "juniper berry": 10,
        "kale": 100,
        "kebab": 150,
        "kettle corn": 50,
        "kidney bean": 100,
        "kingfish": 150,
        "kipper": 100,
        "kiwi fruit": 60,
        "knish": 80,
        "kohlrabi": 100,
        "kombu": 30,
        "kumquat": 50,
        "lamb": 200,
        "lamb chops": 200,
        "lamb's lettuce": 100,
        "lasagna": 250,
        "lavender": 10,
        "leek": 100,
        "lemon": 100,
        "lemon peel": 20,
        "lentil": 100,
        "lettuce": 100,
        "lima bean": 100,
        "lime": 50,
        "lobster": 150,
        "lobster bisque": 200,
        "loin": 200,
        "lollipop": 20,
        "lotus root": 100,
        "lox": 50,
        "lychee": 60,
        "macadamia nut": 28,
        "macaron": 30,
        "macaroni": 100,
        "macaroon": 30,
        "mackerel": 150,
        "mandarin orange": 100,
        "mango": 150,
        "maple syrup": 50,
        "marjoram": 10,
        "marshmallow": 20,
        "marzipan": 30,
        "mashed potatoes": 200,
        "meat": 150,
        "meat pie": 200,
        "meatball": 50,
        "meatloaf": 200,
        "melon": 150,
        "meringue": 30,
        "millet": 100,
        "mint": 10,
        "miso soup": 150,
        "mochi": 60,
        "mousse": 100,
        "mozzarella": 30,
        "muesli": 50,
        "muffin": 60,
        "mulberry": 50,
        "mung bean": 100,
        "mushroom": 100,
        "mussel": 100,
        "mutton": 200,
        "nachos": 200,
        "napa cabbage": 100,
        "nectarine": 100,
        "nigiri": 50,
        "noodle": 100,
        "nori": 10,
        "nougat": 40,
        "nut": 28,
        "oat": 100,
        "oatmeal": 150,
        "octopus": 100,
        "okra": 100,
        "olive": 30,
        "omelette": 150,
        "onion": 100,
        "onion rings": 100,
        "orange": 150,
        "oyster": 100,
        "pad thai": 250,
        "paella": 200,
        "pancake": 100,
        "pancetta": 50,
        "panna cotta": 100,
        "papaya": 150,
        "parfait": 100,
        "parmesan": 30,
        "parsnip": 100,
        "passionfruit": 60,
        "pasta": 100,
        "pastrami": 100,
        "pastry": 100,
        "pate": 50,
        "pea": 100,
        "peach": 120,
        "peanut": 28,
        "peapod": 100,
        "pear": 150,
        "pearl onion": 20,
        "pecan": 28,
        "penne": 100,
        "pepperoni": 50,
        "perch": 150,
        "persimmon": 100,
        "pho": 100,
        "pickle": 30,
        "pie": 200,
        "pike": 150,
        "pilaf": 150,
        "pine nut": 20,
        "pineapple": 150,
        "pistachio": 28,
        "pita bread": 60,
        "pizza": 250,
        "plum": 80,
        "polenta": 100,
        "pomegranate": 100,
        "pomelo": 150,
        "popcorn": 40,
        "popovers": 50,
        "poppy seed roll": 40,
        "popsicle": 60,
        "pork": 200,
        "pork chop": 150,
        "pork pie": 200,
        "porridge": 150,
        "pot roast": 200,
        "potato": 100,
        "potato onion": 100,
        "poutine": 200,
        "praline": 40,
        "prawn": 100,
        "pretzel": 30,
        "prime rib": 250,
        "prosciutto": 50,
        "prune": 40,
        "pudding": 150,
        "pumpkin": 100,
        "pumpkin seeds": 30,
        "quiche": 150,
        "quince": 100,
        "quinoa": 100,
        "radicchio": 100,
        "radish": 100,
        "raisin": 30,
        "raisin bread": 50,
        "rambutan": 50,
        "ramen": 200,
        "raspberry": 50,
        "ratatouille": 200,
        "ravioli": 150,
        "red cabbage": 100,
        "red velvet cake": 200,
        "rhubarb": 100,
        "ribbon-cut pasta": 100,
        "rice": 100,
        "risotto": 150,
        "roast beef": 200,
        "roe": 30,
        "romaine": 100,
        "roquefort": 30,
        "rosemary": 10,
        "rutabaga": 100,
        "sage": 10,
        "salad/ rau xào/ rau luộc": 150,
        "salami": 50,
        "salmon": 200,
        "salsa": 100,
        "samosa": 80,
        "sandwich": 200,
        "sardine": 50,
        "sashimi": 100,
        "sauerkraut": 100,
        "sausage": 100,
        "sausage roll": 50,
        "scallion": 20,
        "scallop": 80,
        "scampi": 100,
        "scone": 50,
        "sea bass": 150,
        "seafood": 200,
        "seaweed salad": 100,
        "sesame seed": 10,
        "shallot": 20,
        "shellfish": 100,
        "sherbet": 80,
        "shish kebab": 150,
        "shortcake": 100,
        "shrimp": 100,
        "sirloin": 200,
        "slaw": 150,
        "smoked fish": 100,
        "smoked salmon": 100,
        "snapper": 150,
        "snow pea": 100,
        "soda bread": 100,
        "sorbet": 80,
        "sorghum": 100,
        "sorrel": 100,
        "souffle": 150,
        "soup": 200,
        "spaghetti bolognese": 250,
        "spaghetti carbonara": 250,
        "spare ribs": 200,
        "spinach": 100,
        "split peas": 100,
        "spring onion": 20,
        "spring rolls": 60,
        "sprinkles": 10,
        "sprouts": 40,
        "squash": 100,
        "squash blossoms": 80,
        "squid": 100,
        "star fruit": 150,
        "steak": 250,
        "stir-fry": 200,
        "strawberry": 100,
        "string bean": 100,
        "strudel": 50,
        "stuffing": 100,
        "sturgeon": 100,
        "succotash": 100,
        "summer squash": 100,
        "sundae": 60,
        "sunflower seeds": 20,
        "sushi": 200,
        "sweet potato": 150,
        "swiss chard": 100,
        "swiss cheese": 30,
        "tabouli": 100,
        "tacos": 200,
        "tagliatelle": 100,
        "tamale": 150,
        "tamarind": 30,
        "tangerine": 100,
        "tart": 100,
        "tartare": 100,
        "tempura": 100,
        "tenderloin": 200,
        "tiramisu": 100,
        "toast": 50,
        "toffee": 40,
        "tofu": 100,
        "tomatillo": 100,
        "tomato": 100,
        "torte": 100,
        "tortellini": 100,
        "tortilla chips": 100,
        "trout": 100,
        "truffle": 30,
        "tuna": 150,
        "tuna tartare": 100,
        "turkey": 200,
        "turkey breast": 200,
        "turnip": 100,
        "venison": 100,
        "vermicelli": 100,
        "wafer": 10,
        "waffle": 100,
        "walnut": 28,
        "water chestnut": 100,
        "watercress": 100,
        "watermelon": 150,
        "whipped cream": 30,
        "whoopie pie": 40,
        "winter melon": 100,
        "yam": 150,
        "yardlong bean": 100,
        "yellow summer squash": 100,
        "yogurt": 150,
        "zucchini": 100,
        "vegetable": 70
      };
      const handleSelectItem = (foodItem) => {
        // Kiểm tra nếu thực phẩm đã được chọn
        if (selectedItems.find((item) => item.id === foodItem.id)) {
            setselectedItems(
                selectedItems.filter((item) => item.id !== foodItem.id)
            );
        } else {
            // Kiểm tra nếu đã chọn đủ 10 thực phẩm
            if (selectedItems.length === 10) {
                enqueueSnackbar('Chỉ lựa chọn dưới 10 thành phần', { variant: 'error' });
                return;
            }
    
            // Lấy lượng tiêu chuẩn từ bảng foodStandardQuantities
            let standardQty = foodStandardQuantities[foodItem.name.toLowerCase()];
    
            // Nếu không có quy chuẩn, tạo giá trị random từ 50 đến 300
            if (!standardQty) {
                standardQty = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
            }
    
            setselectedItems([
                ...selectedItems,
                { ...foodItem, qty: standardQty, unit: 'gm' },
            ]);
        }
    };
    

    const handleModifyItem = ({ value, id, field }) => {
        setselectedItems((prevState) => {
            const items = [...prevState];
            const idx = items.findIndex((item) => item.id === id);
            items[idx] = { ...items[idx], [field]: value };
            return items;
        });
    };

    const handleNext = async () => {
        if (selectedItems.length === 0) {
            enqueueSnackbar('Vui lòng chọn ít nhất 1 thành phần', {
                variant: 'error',
            });
            return;
        }

        setisLoading(true);
        try {
            const res = await API.foodNutritionDetails({
                image_url: image,
                food_item: selectedItems
                    .reduce(
                        (prev, curr, idx, arr) =>
                            prev +
                            `${curr.qty} ${curr.unit} ` +
                            curr.name +
                            (idx === arr.length - 1 ? '' : ', '),
                        ''
                    )
                    .substring(0, 90),
            });
            setscreen(true);
            setnutrientsList(res.nutrients);
            setconsumed_food_id(res.consumed_food_id);
        } catch (err) {
            if (err?.response?.data?.msg)
                enqueueSnackbar(err.response.data.msg, {
                    variant: 'error',
                });
            else
                enqueueSnackbar('Đã có lỗi xảy ra. Try again', {
                    variant: 'error',
                });
        }
        setisLoading(false);
    };

    useEffect(() => {
        if (!state.image_url || !state.foodItems || !state.imageBlob)
            navigate('/');
        else {
            setimage(state.image_url);
            setfoodItems(state.foodItems);
            setimageBlob(state.imageBlob);
        }
    }, []);
    const FoodSuggestionTable = () => {
        const foodIngredients = [
            { id: 1, name: 'Cơm (1 bát con)', weight: 150},
            { id: 2, name: 'Thịt bò (1 phần nhỏ)', weight: 200},
            { id: 3, name: 'Thịt gà (1 phần nhỏ)', weight: 150},
            { id: 4, name: 'Cá thu (1 lát)', weight: 100},
            { id: 5, name: 'Tôm (10 con nhỏ)', weight: 80},
            { id: 6, name: 'Đậu phụ (1 lát)', weight: 50},
            { id: 7, name: 'Rau cải (1 bó nhỏ)', weight: 200 },
            { id: 8, name: 'Khoai tây (1 củ vừa)', weight: 150},
            { id: 9, name: 'Cà rốt (1 củ nhỏ)', weight: 100, unit: 'g (1 củ nhỏ)' },
            { id: 10, name: 'Cà chua (1 quả vừa)', weight: 120, unit: 'g (1 quả vừa)' },
            { id: 11, name: 'Hành lá (1 nhánh nhỏ)', weight: 20, unit: 'g (1 nhánh nhỏ)' },
            { id: 12, name: 'Tỏi (1 củ nhỏ)', weight: 10, unit: 'g (1 củ nhỏ)' },
            { id: 13, name: 'Ớt (1 quả nhỏ)', weight: 5, unit: 'g (1 quả nhỏ)' },
            { id: 14, name: 'Hành tím (1 củ lớn)', weight: 50, unit: 'g (1 củ lớn)' },
            { id: 15, name: 'Rau muống (1 bó nhỏ)', weight: 200, unit: 'g (1 bó nhỏ)' },
            { id: 16, name: 'Đậu que (1 phần nhỏ)', weight: 150, unit: 'g (1 phần nhỏ)' },
            { id: 17, name: 'Măng tây (1 bó nhỏ)', weight: 200, unit: 'g (1 bó nhỏ)' },
            { id: 18, name: 'Bông cải xanh (1 cái nhỏ)', weight: 250, unit: 'g (1 cái nhỏ)' },
            { id: 19, name: 'Bắp cải (nửa trái)', weight: 300, unit: 'g (1/2 cái nhỏ)' },
            { id: 20, name: 'Ớt chuông (1 quả vừa)', weight: 150, unit: 'g (1 quả vừa)' },
            { id: 21, name: 'Nấm hương (10 cái nhỏ)', weight: 100, unit: 'g (10 cái nhỏ)' },
            { id: 22, name: 'Nấm kim châm (1 gói nhỏ)', weight: 200, unit: 'g (1 gói nhỏ)' },
            { id: 23, name: 'Thịt lợn (1 phần lớn)', weight: 200, unit: 'g (1 phần lớn)' },
            { id: 24, name: 'Sườn lợn (1 phần lớn)', weight: 300, unit: 'g (1 phần lớn)' },
            { id: 25, name: 'Thịt vịt (1 phần vừa)', weight: 250, unit: 'g (1 phần vừa)' },
            { id: 26, name: 'Cá basa (1 lát lớn)', weight: 200, unit: 'g (1 lát lớn)' },
            { id: 27, name: 'Hải sản - ngao (1 bát tô nhỏ)', weight: 300, unit: 'g (1 bát tô nhỏ)' },
            { id: 28, name: 'Tôm hùm (1 con nhỏ)' , weight: 400, unit: 'g (1 con nhỏ)' },
            { id: 29, name: 'Xương lợn (1 phần lớn)', weight: 500, unit: 'g (1 phần lớn)' },
            { id: 30, name: 'Mì khô (1 vắt)', weight: 100, unit: 'g (1 vắt)' },
            { id: 31, name: 'Bột mì (1 bát con)', weight: 200, unit: 'g (1 bát con)' },
            { id: 32, name: 'Bột năng (1 bát con)', weight: 150, unit: 'g (1 bát con)' },
            { id: 33, name: 'Bột gạo (1 bát con)', weight: 200, unit: 'g (1 bát con)' },
            { id: 34, name: 'Đường trắng (1 bát con)', weight: 150, unit: 'g (1 bát con)' },
            { id: 35, name: 'Muối (1 thìa lớn)', weight: 50, unit: 'g (1 thìa lớn)' },
            { id: 36, name: 'Tiêu đen (1 thìa nhỏ)', weight: 10, unit: 'g (1 thìa nhỏ)' },
            { id: 37, name: 'Bột ngọt (1 thìa nhỏ)', weight: 5, unit: 'g (1 thìa nhỏ)' },
            { id: 38, name: 'Nước mắm (1 thìa lớn)', weight: 50, unit: 'ml (1 thìa lớn)' },
            { id: 39, name: 'Dầu ăn (1 thìa lớn)', weight: 50, unit: 'ml (1 thìa lớn)' },
            { id: 40, name: 'Dầu ô liu (1 thìa lớn)', weight: 50, unit: 'ml (1 thìa lớn)' },
            { id: 41, name: 'Bơ (1 thìa lớn)', weight: 50, unit: 'g (1 thìa lớn)' },
            { id: 42, name: 'Phô mai (1 lát nhỏ)', weight: 30, unit: 'g (1 lát nhỏ)' },
            { id: 43, name: 'Trứng gà (1 quả nhỏ)', weight: 50, unit: 'g (1 quả)' },
            { id: 44, name: 'Trứng vịt (1 quả nhỏ)', weight: 70, unit: 'g (1 quả)' },
            { id: 45, name: 'Sữa tươi (1 ly nhỏ)', weight: 200, unit: 'ml (1 ly nhỏ)' },
            { id: 46, name: 'Sữa đặc (1 thìa lớn)', weight: 50, unit: 'g (1 thìa lớn)' },
            { id: 47, name: 'Nước cốt dừa (1 bát con)', weight: 100, unit: 'ml (1 bát con)' },
            { id: 48, name: 'Bột ca cao (1 thìa nhỏ)', weight: 20, unit: 'g (1 thìa nhỏ)' },
            { id: 49, name: 'Bột cà phê (1 thìa nhỏ)', weight: 20, unit: 'g (1 thìa nhỏ)' },
            { id: 50, name: 'Lá chanh (5 lá)', weight: 5, unit: 'g (5 lá)' },
            { id: 51, name: 'Lá quế (1 bó nhỏ)', weight: 10, unit: 'g (1 bó nhỏ)' },
            { id: 52, name: 'Húng lủi (1 bó nhỏ)', weight: 20, unit: 'g (1 bó nhỏ)' },
            { id: 53, name: 'Lá lốt (10 lá)', weight: 20, unit: 'g (10 lá)' },
            { id: 54, name: 'Rau thơm (1 bó nhỏ)', weight: 50},
            { id: 55, name: 'Rau má (1 bó nhỏ)', weight: 150},
            { id: 56, name: 'Rau dền (1 bó nhỏ)', weight: 200},
            { id: 57, name: 'Măng (1 phần nhỏ)', weight: 250},
            { id: 58, name: 'Củ hành (1 củ lớn)', weight: 100 },
            { id: 59, name: 'Củ cải trắng (1 củ vừa)', weight: 200},
            { id: 60, name: 'Nấm rơm (1 phần nhỏ)', weight: 150},
            // Tiếp tục thêm các thành phần khác lên đến 100...
        ];
        
        
        
    
        return (
            <div
                style={{
                    margin: '20px auto',
                    width: '80%',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow:
                        '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                }}
            >
                <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
                    Bảng gợi ý trọng lượng món ăn
                </h3>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontFamily: 'Arial, sans-serif',
                        textAlign: 'center',
                    }}
                >
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>STT</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên món ăn</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>
                                Trọng lượng tham khảo (g)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodIngredients.map((food) => (
                            <tr key={food.id} style={{ background: food.id % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{food.id}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{food.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{food.weight}g</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    return (
        <div
            maxWidth='lg'
            style={{ backgroundColor: 'var(--backgroundColor)' }}
        >
            <FullPageLoading isLoading={isLoading} />
            <Box sx={{ pb: '2rem' }}>
                {!screen ? (
                    <Container maxWidth='md'>
                        <div>
                            <div
                                style={{
                                    paddingTop: '1rem',
                                    background: 'var(--backgroundColor)',
                                    position: 'fixed',
                                    width: '100%',
                                    padding: '0.8rem 0.5rem 0.5rem 0.5rem',
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <Container maxWidth='md'>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <button
                                            style={{
                                                display: 'block',
                                                background:
                                                    'var(--backgroundColor)',
                                                border: '0',
                                            }}
                                            onClick={(e) => {
                                                navigate('/dashboard');
                                            }}
                                        >
                                            {' '}
                                            <KeyboardBackspaceIcon
                                                sx={{ fontSize: '35px' }}
                                            />
                                        </button>

                                        <button
                                            style={{
                                                display: 'flex',
                                                border: '0',
                                                padding: '8px',
                                                background: 'var(--themecolor)',
                                                color: '#fff',
                                                margin: '3px 8px 0 0',
                                                borderRadius: '4px',
                                                alignItems: 'center',
                                            }}
                                            onClick={handleNext}
                                        >
                                            {' '}
                                            <span style={{ fontSize: '16px' }}>
                                                Tiếp theo
                                            </span>{' '}
                                            <ArrowForwardIos
                                                sx={{ fontSize: '16px' }}
                                            />
                                        </button>
                                    </div>
                                </Container>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingTop: '4.3rem',
                                }}
                            >
                                <img
                                    style={{
                                        objectFit: 'cover',
                                        width: '94%',
                                        height: '35vh',
                                        borderRadius: '8px',
                                    }}
                                    src={imageBlob}
                                    alt=''
                                ></img>
                            </div>

                            <div style={{ display: 'inline' }}>
                                <input
                                    type='file'
                                    accept='image/*'
                                    capture='environment'
                                    id='img'
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files)
                                            handleSelectImage(
                                                e.target.files[0]
                                            );
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginRight: '6px',
                                    }}
                                >
                                    <label
                                        htmlFor='img'
                                        style={{
                                            padding: '5px',
                                            background: 'var(--themecolor)',
                                            color: '#fff',
                                            width: '6.8rem',
                                            margin: '10px 8px 0 0',
                                            borderRadius: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CameraswitchIcon />{' '}
                                        <span style={{ marginLeft: '7px' }}>
                                            Chụp lại
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <h3 align='center' style={{ marginTop: '8px' }}>
                                Lựa chọn thành phần
                            </h3>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    margin: '20px auto 0 auto',
                                    width: '97%',
                                    height: '39vh',
                                    overflow: 'scroll',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    background: 'var(--lightOrange)',
                                    boxShadow:
                                        '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                }}
                            >
                                <table
                                    style={{
                                        padding: '0.1rem',
                                        width: '100%',
                                    }}
                                >
                                    <tbody>
                                        {foodItems.map((item, idx, arr) => {
                                            const selectedItem =
                                                selectedItems.find(
                                                    (x) => x.id === item.id
                                                );
                                            return (
                                                <Fragment key={item.id}>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                position:
                                                                    'relative',
                                                            }}
                                                            onClick={() => {
                                                                handleSelectItem(
                                                                    item
                                                                );
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display:
                                                                        'inline-block',
                                                                    marginLeft:
                                                                        '16px',
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                            {Boolean(
                                                                selectedItem
                                                            ) ? (
                                                                <span>
                                                                    <span
                                                                        style={{
                                                                            position:
                                                                                'absolute',
                                                                            left: 0,
                                                                            marginTop:
                                                                                '4px',
                                                                        }}
                                                                    >
                                                                        <CheckCircleOutlineIcon
                                                                            sx={{
                                                                                display:
                                                                                    'inline',
                                                                                color: 'var(--themecolor)',
                                                                            }}
                                                                        />
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            position:
                                                                                'absolute',
                                                                            right: 0,
                                                                        }}
                                                                    >
                                                                        <input
                                                                            style={{
                                                                                padding:
                                                                                    '5px',
                                                                                width: '4rem',
                                                                                background:
                                                                                    'var(--backgroundColor)',
                                                                                borderRadius:
                                                                                    '3px',
                                                                                border: '1px solid var(--backgroundColor)',
                                                                                marginRight:
                                                                                    '0.4rem',
                                                                            }}
                                                                            onClick={(
                                                                                event
                                                                            ) => {
                                                                                event.stopPropagation();
                                                                            }}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleModifyItem(
                                                                                    {
                                                                                        value: e
                                                                                            .target
                                                                                            .value,
                                                                                        id: item.id,
                                                                                        field: 'qty',
                                                                                    }
                                                                                )
                                                                            }
                                                                            type='number'
                                                                            value={String(
                                                                                selectedItem.qty
                                                                            )}
                                                                        />
                                                                        <select
                                                                            style={{
                                                                                backgroundColor:
                                                                                    'var(--lightOrange)',
                                                                                border: '1px solid var(--lightOrange)',
                                                                            }}
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                            }}
                                                                            value={
                                                                                selectedItem.unit
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleModifyItem(
                                                                                    {
                                                                                        value: e
                                                                                            .target
                                                                                            .value,
                                                                                        id: item.id,
                                                                                        field: 'unit',
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {UNITS.map(
                                                                                (
                                                                                    unit
                                                                                ) => (
                                                                                    <option
                                                                                        value={
                                                                                            unit
                                                                                        }
                                                                                        key={
                                                                                            unit
                                                                                        }
                                                                                        style={{
                                                                                            backgroundColor:
                                                                                                'var(--backgroundColor)',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            unit
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        </select>
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {idx !== arr.length - 1 && (
                                                        <Divider />
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Container>
                ) : (
                    <Nutrients
                        setisLoading={setisLoading}
                        consumedFoodId={consumed_food_id}
                        nutrientsList={nutrientsList}
                        setscreen={setscreen}
                        image_url={image}
                        imageBlob={imageBlob}
                    />
                )}
            </Box>
        <div>
            <FoodSuggestionTable />
        </div>
        </div>
    );
    
};

export default ScannedImg;
