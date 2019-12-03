import React from 'react';
import { FlatList, Text, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrderScreen = () => {
  const orders = useSelector(state => state.orders.orders);

  return (
    <FlatList
      data={orders}
      renderItem={itemData => (
        <Text>
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.redeableDate}
            items={itemData.item.items}
          />
        </Text>
      )}
    />
  );
};

OrderScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Cart',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

export default OrderScreen;
