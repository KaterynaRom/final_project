import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './reducers/cartReducer';
import userReducer from './reducers/userReducer';

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});
