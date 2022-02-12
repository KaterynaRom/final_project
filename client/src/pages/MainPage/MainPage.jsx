import React from 'react';
import styles from './MainPage.module.scss';
import MainSlider from '../../components/MainSlider/MainSlider';
import Genres from '../../components/Genres/Genres';
import MainNew from '../../components/MainNew/MainNew';

function MainPage() {
  return (
    <div className={styles.main}>
      <MainSlider />
      <Genres />
      <MainNew />
    </div>
  );
}

export default MainPage;
