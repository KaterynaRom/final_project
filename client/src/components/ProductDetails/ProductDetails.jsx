import styles from './ProductDetails.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import {
  switchImagesModalState,
  addContentForImagesModal,
} from '../../store/reducers/imagesModalReducer';
import ProductDetailsSlider from '../ProductDetailsSlider/ProductDetailsSlider';
import {
  addItemToTheCartForNotLog,
  addMoreThanOneProductsToTheCart,
} from '../../store/reducers/cartReducer';
import {openSignModal} from '../../store/reducers/signInUpReducer';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import ProductDetailsAbout from '../ProductDetailsAbout/ProductDetailsAbout';
import ProductDetailsButtons from '../ProductDetailsButtons/ProductDetailsButtons';
import {addWishedProduct, removeWishedProduct} from '../../store/reducers/wishlistReducer';
import {
  switchActionMessage,
  addTypeActionMessage,
  addTextActionMessage,
} from '../../store/reducers/actionMessageReducer';
import instance from '../../api/instance';

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
  const sliderRef = useRef(null);
  const {wishlist} = useSelector((state) => state.wishlist);
  const [isFavourite, setIsFavourite] = useState(false);
  const [countInputValue, setCountInputValue] = useState(1);

  const actionMessage = (type, text, time) => {
    dispatch(addTypeActionMessage(type));
    dispatch(addTextActionMessage(text));
    dispatch(switchActionMessage());
    setTimeout(() => {
      dispatch(switchActionMessage());
    }, time);
  };

  useEffect(() => {
    const openModalImages = (currentImg) => {
      const currentUrls = imageUrls.slice();
      const index = currentUrls.findIndex((item) => item === currentImg);
      currentUrls.splice(index, 1);
      currentUrls.unshift(currentImg);
      dispatch(addContentForImagesModal(currentUrls));
      dispatch(switchImagesModalState());
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.querySelector('#thumbnail-div').style.justifyContent = 'space-evenly';
      slider.querySelector('#thumbnail-div').style.marginTop = '40px';
      slider.querySelectorAll('.thumbnail').forEach((item) => (item.style.height = `70px`));

      slider.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
          openModalImages(event.target.src);
        }
      });
    }

    return () => {
      if (slider) {
        slider.removeEventListener('click', (event) => {
          if (event.target.tagName === 'IMG') {
            openModalImages(event.target.src);
          }
        });
      }
    };
  }, []);

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
          await dispatch(addMoreThanOneProductsToTheCart(cartItem));
          actionMessage('successful', 'Successfully added to the cart', 1000);
        } catch (e) {
          actionMessage('error', 'Something went wrong, please try to reload page', 1500);
        }
      })();
      return;
    }
    dispatch(addItemToTheCartForNotLog(cartItem));
    actionMessage('successful', 'Successfully added to the cart', 1000);
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
          actionMessage('successful', 'Successfully added to the wishlist', 1000);
        } catch (e) {
          actionMessage('error', 'Something went wrong, please try to reload page', 1500);
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
      <div ref={sliderRef} className={styles.productIMGWrapper}>
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