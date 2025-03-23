import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EpisodeDetailedScreen from '../screens/EpisodeDetailedScreen';

export type AppNavigatorParamList = {
  HomeScreen: undefined;
  EpisodeDetailedScreen: {episodeId: string};
};

const Stack = createNativeStackNavigator<AppNavigatorParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EpisodeDetailedScreen"
          component={EpisodeDetailedScreen}
          options={{title: 'Episode '}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
