import styles from './ProductDetails.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import ProductDetailsSlider from '../ProductDetailsSlider/ProductDetailsSlider';
import {addItemToTheCartNotLog, addProductsToTheCart} from '../../store/reducers/cartReducer';
import {openSignModal} from '../../store/reducers/signInUpReducer';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import ProductDetailsAbout from '../ProductDetailsAbout/ProductDetailsAbout';
import ProductDetailsButtons from '../ProductDetailsButtons/ProductDetailsButtons';
import {addWishedProduct, removeWishedProduct} from '../../store/reducers/wishlistReducer';
import {showMessage} from '../../store/reducers/messageReducer';

const ProductDetails = (props) => {
  const {
    title,
    currentPrice,
    previousPrice,
    description,
    itemNo,
    genre,
    publisher,
    imageUrls,
    age,
    _id,
    platform,
    quantity,
  } = props;

  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.user.isAuthorized);

  const {wishlist} = useSelector((state) => state.wishlist);
  const [isFavourite, setIsFavourite] = useState(false);
  const [countInputValue, setCountInputValue] = useState(1);

  useEffect(() => {
    if (wishlist.length === 0) {
      setIsFavourite(false);
      return;
    }

    wishlist.forEach((item) => {
      if (item.itemNo === itemNo) {
        setIsFavourite(true);
        return;
      }
      setIsFavourite(false);
    });
  }, [wishlist]);

  const addToCart = () => {
    const cartItem = {product: props, cartQuantity: countInputValue};

    if (isAuthorized) {
      (async () => {
        try {
          await dispatch(addProductsToTheCart(cartItem));
          dispatch(showMessage({text: 'Successfully added to the cart'}));
        } catch (e) {
          dispatch(
            showMessage({text: 'Something went wrong, please try to reload page', type: 'error'}),
          );
        }
      })();
      return;
    }
    dispatch(addItemToTheCartNotLog(cartItem));
    dispatch(showMessage({text: 'Successfully added to the cart'}));
  };

  const openModal = () => {
    dispatch(openSignModal());
  };

  const switchWishItem = () => {
    if (isAuthorized) {
      if (isFavourite) {
        dispatch(removeWishedProduct(_id));
        return;
      }
      (async () => {
        try {
          await dispatch(addWishedProduct(_id));
          dispatch(showMessage({text: 'Successfully added to the wishlist'}));
        } catch (e) {
          dispatch(
            showMessage({text: 'Something went wrong, please try to reload page', type: 'error'}),
          );
        }
      })();
      return;
    }
    openModal();
  };

  if (!Object.keys(props).length) return <NotFoundPage />;
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mobileProductTitle}>
        <h2 className={styles.mobileProductTitle_Text}>{title}</h2>
        <span className={styles.mobileProductTitle_Code}>{itemNo}</span>
      </div>
      <div className={styles.productIMGWrapper}>
        <ProductDetailsSlider imageUrls={imageUrls} />
      </div>
      <div className={styles.content}>
        <div className={styles.content_Title}>
          <h2 className={styles.content_Title_Text}>{title}</h2>
          <span className={styles.content_Title_Code}>{itemNo}</span>
        </div>
        <div className={styles.content_Price}>
          {previousPrice !== 0 && previousPrice !== currentPrice ? (
            <div className={styles.priceBox}>
              <div className={styles.content_Price_Item}>{currentPrice} &#8372;</div>
              <div className={styles.previousPrice}>{previousPrice} &#8372;</div>
            </div>
          ) : (
            <div className={styles.content_Price_Item}>{currentPrice} &#8372;</div>
          )}
          <ProductDetailsButtons
            quantity={quantity}
            setCountInputValue={setCountInputValue}
            countInputValue={countInputValue}
            addToCart={addToCart}
            switchWishItem={switchWishItem}
            isFavourite={isFavourite}
          />
        </div>
        <ProductDetailsAbout
          description={description}
          genre={genre}
          platform={platform}
          publisher={publisher}
          age={age}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
