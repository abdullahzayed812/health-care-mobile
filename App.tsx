import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { store } from './src/app/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

const App: React.FC = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PaperProvider
          theme={theme}
          settings={{
            // eslint-disable-next-line react/no-unstable-nested-components
            icon: props => <MaterialCommunityIcons {...props} />,
          }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={theme.colors.primary}
          />
          <AppNavigator />
        </PaperProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
