import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { connect } from 'react-redux';
import * as cartActions from '../../store/actions/cartActions';
import * as authActions from '../../store/actions/authActions';

import './style.css';
import { base_url } from '../../constants';

class ProductDetails extends Component {
  state = {
    product: null,
    redirectToReferrer: false
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props
        .getToken()
        .then(result => {
          if (result) {
            this.props
              .getCartItems(this.props.auth.token, this.props.auth.user.userId)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    const { category, slug } = this.props.match.params;
    fetch(`${base_url}/products/${category}/${slug}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.hasOwnProperty('message')) {
          console.log(jsonResponse);
          this.setState({
            product: jsonResponse.message
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  addToCart = (productId, price, name, image) => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
      return;
    }

    const { auth } = this.props;
    const cartItem = {
      user: auth.user.userId,
      product: productId,
      name: name,
      image: image,
      quantity: 1,
      price: price
    };
    this.props
      .addToCart(auth.token, cartItem)
      .then(response => {
        //console.log(response);
        console.log(this.props.cart);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { product } = this.state;

    let productDescription;

    if (this.state.product) {
      productDescription = (
        <div className='Content'>
          <div className='ProductDetailsWrapper'>
            <div className='ProductDetailsImage'>
              <div className='ProductDetailsImageWrapper'>
                <img src={product.productPic[0].img} alt='' />
              </div>
              <div className='ActionButtonWrapper'>
                <button
                  onClick={() => {
                    this.addToCart(
                      product._id,
                      product.price,
                      product.name,
                      product.productPic[0].img
                    );
                  }}
                >
                  <i className='fas fa-shopping-cart'></i>&nbsp;ADD TO CART
                </button>
                
              </div>
            </div>
            <div className='ProductDetails'>
              <p className='ProductTitle'>{product.name}</p>
              <p className='ProductPrice'>${product.price}</p>
              <div className='ProductDescription'>
                <h2>Product Description</h2>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      productDescription = <div>Product is loading...!</div>;
    }

    return (
      <div>
        <Header />
        {productDescription}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    cart: state.cart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (token, cartItem) =>
      dispatch(cartActions.addToCart(token, cartItem)),
    getCartItems: (token, userId) =>
      dispatch(cartActions.getCartItems(token, userId)),
    getToken: () => dispatch(authActions.getToken())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
