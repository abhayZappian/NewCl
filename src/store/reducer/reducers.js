// reducers.js
import { combineReducers } from 'redux';
import journeyCanvas from './journeyCanvas';
import presets from './presets/index';
import customizationReducer from '../customizationReducer';
import dataManagement from './dataManagement'
import common from './common';

const rootReducer = combineReducers({
  journeyCanvas,
  presets,
  dataManagement,
  common,
  customization: customizationReducer,
  // other reducers...
});

export default rootReducer;
