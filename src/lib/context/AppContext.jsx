'use client';
import { createContext, useCallback, useContext, useReducer } from 'react';

import {
  clearAllCache,
  getJourneys,
  getUserById,
  getUsers,
  refreshUser
} from '@/lib/services/dataService';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  UPDATE_JOURNEY_DATA: 'UPDATE_JOURNEY_DATA',
  CLEAR_CACHE: 'CLEAR_CACHE'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  notification: null,
  userData: {},
  journeyData: {}
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload
      };

    case ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null
      };

    case ACTIONS.UPDATE_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.payload.key]: action.payload.data
        }
      };

    case ACTIONS.UPDATE_JOURNEY_DATA:
      return {
        ...state,
        journeyData: {
          ...state.journeyData,
          [action.payload.key]: action.payload.data
        }
      };

    case ACTIONS.CLEAR_CACHE:
      // Clear all service caches
      clearAllCache();
      return {
        ...state,
        userData: {},
        journeyData: {}
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setLoading = useCallback(loading => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback(error => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const setNotification = useCallback(notification => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: notification });
  }, []);

  const clearNotification = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATION });
  }, []);

  const updateUserData = useCallback((key, data) => {
    dispatch({
      type: ACTIONS.UPDATE_USER_DATA,
      payload: { key, data }
    });
  }, []);

  const updateJourneyData = useCallback((key, data) => {
    dispatch({
      type: ACTIONS.UPDATE_JOURNEY_DATA,
      payload: { key, data }
    });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CACHE });
  }, []);

  // Async data operations
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const users = await getUsers();
      updateUserData('list', users);
      return users;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateUserData]);

  const fetchUserById = useCallback(
    async userId => {
      try {
        setLoading(true);
        const user = await getUserById(userId);
        updateUserData(userId, user);
        return user;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, updateUserData]
  );

  const fetchJourneys = useCallback(
    async userId => {
      try {
        setLoading(true);
        const journeys = await getJourneys(userId);
        updateJourneyData(userId, journeys);
        return journeys;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, updateJourneyData]
  );

  const refreshUserData = useCallback(
    async userId => {
      try {
        setLoading(true);
        const result = await refreshUser(userId);
        setNotification({
          type: 'success',
          message: 'User data refreshed successfully',
          duration: 3000
        });
        return result;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setNotification]
  );

  const contextValue = {
    ...state,
    actions: {
      setLoading,
      setError,
      setNotification,
      clearNotification,
      updateUserData,
      updateJourneyData,
      clearCache,
      fetchUsers,
      fetchUserById,
      fetchJourneys,
      refreshUser: refreshUserData
    }
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
