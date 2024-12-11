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
    const [loading, setLoading] = useState(false);  // For managing loading state
    const [error, setError] = useState(null);
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
    const handleSelectItem = (foodItem) => {
        if (selectedItems.find((item) => item.id === foodItem.id)) {
            setselectedItems(
                selectedItems.filter((item) => item.id !== foodItem.id)
            );
        } else {
            if (selectedItems.length === 10) {
                enqueueSnackbar('Chỉ lựa chọn dưới 10 thành phần', { variant: 'error' });
                return;
            }
    
            const randomQty = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
    
            setselectedItems([
                ...selectedItems,
                { ...foodItem, qty: randomQty, unit: 'gm' },
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
    
    const fetchFoodItems = async (imageUrl) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/src/apis/clarifai/detect-food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: imageUrl }),
            });
            if (!response.ok) throw new Error('Failed to fetch food items');
            const data = await response.json();
            return data.foodItems;
        } catch (err) {
            setError('Something went wrong: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!state.image_url || !state.foodItems || !state.imageBlob) {
            navigate('/');
        } else {
            setimage(state.image_url);
            setfoodItems(state.foodItems);
            setimageBlob(state.imageBlob);
        }
    }, [state.image_url, state.foodItems, state.imageBlob]);

    // useEffect(() => {
    //     if (!state.image_url || !state.foodItems || !state.imageBlob)
    //         navigate('/');
    //     else {
    //         setimage(state.image_url);
    //         setfoodItems(state.foodItems);
    //         setimageBlob(state.imageBlob);
    //     }
    // }, []);
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
