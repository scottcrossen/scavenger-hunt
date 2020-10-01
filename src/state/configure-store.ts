import { createStore, Store, applyMiddleware, compose } from 'redux';
import { rootReducer } from './root-reducer';
import thunk from 'redux-thunk';

interface HotModule extends NodeModule {
  hot: {
    accept(arg1: string, arg2: () => void): void;
  };
}

const hotModule = module as HotModule;

export const configureStore = (
  initialState: Record<string, unknown> = {},
): Store => {
  const store: Store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk)),
  );
  if (hotModule.hot) {
    hotModule.hot.accept('./', () => {
      const nextRootReducer = require('./root-reducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};
