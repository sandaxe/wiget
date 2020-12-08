import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './card.css';


export class CardComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.any,
    description: PropTypes.any,
    image: PropTypes.any,
    action: PropTypes.func
  };
  /*
  Card Component Props
  1. Title (Big Text)
  2. Image
  3. Buttons / Icons
  */

  render() {
    let { description, image, action, title } = this.props;
    return (
      <div className={styles.card} onClick={action}>
        <img src={image} alt=
          "img" className={styles.cardIcon}/>

        <p className={styles.cardTitle}>{title}</p>
        <div className={styles.bodyOfCard}>
          <p className={styles.cardDescription}>{description}</p>
          <img src={require('../../images/right-arrow.png')} alt="arrow-right"
            width="22" height ="35" className={styles.arrow}/>
        </div>
      </div>);
  }
}
