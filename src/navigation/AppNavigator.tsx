import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailedEpisodeScreen from '../screens/EpisodeDetailedScreen';

export type AppNavigatorParamList = {
  HomeScreen: undefined;
  DetailedEpisodeScreen: {episodeId: number};
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
          name="DetailedEpisodeScreen"
          component={DetailedEpisodeScreen}
          options={{title: 'Episode '}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
