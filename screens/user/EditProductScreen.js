import React, { useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;

    for (const key in updatedValidities) {
      updatedFormIsValid = formIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
};

const EditProductScreen = props => {
  const prodId = props.navigation.getPram('productId');

  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('wrong input', 'Please check the errors on the input', [
        { text: 'Okay' }
      ]);
      return;
    }

    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productsActions.create(
          formState.inputValues.title,
          formState.inputValues.imageUrl,
          formState.inputValues.description,
          +formState.inputValues.price
        )
      );
    }

    props.navigation.goBack();
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setPrams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        inputId: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (prod)
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView>
          <View style={styles.form}>
            <Input
              id="title"
              label="title"
              errorText="Please enter a valid title!"
              keyboardType="default"
              autoCapitalize="sentences"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedProduct ? editedProduct.title : ''}
              initiallyValid={!!editedProduct}
              required
            />
            <Input
              id="imageUrl"
              label="Image URL"
              errorText="Please enter a valid image url!"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedProduct ? editedProduct.imageUrl : ''}
              initiallyValid={!!editedProduct}
              required
            />
            {editedProduct ? null : (
              <Input
                id="price"
                label="Price"
                errorText="Please enter a valid price!"
                keyboardType="decimal-pad"
                autoCapitalize="sentences"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                min={0.1}
              />
            )}
            <Input
              id="description"
              label="description"
              errorText="Please enter a valid description!"
              keyboardType="default"
              autoCapitalize="sentences"
              returnKeyType="next"
              autoCorrect
              multiline
              numberOfLines={3}
              initialValue={editedProduct ? editedProduct.description : ''}
              initiallyValid={!!editedProduct}
              onInputChange={inputChangeHandler.bind(this, 'description')}
              required
              minLength={5}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getPram('submit');

  return {
    headerTitle: navData.navigation.getPram('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  }
});

export default EditProductScreen;
