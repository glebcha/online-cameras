import _ from 'lodash'
import {
    REQUEST_CAMERAS,
    RECEIVE_CAMERAS,
    CAMERAS_ERROR,
    ADD_FAVORITE,
    ADD_FAVORITES,
    REMOVE_FAVORITE
} from '../constants/cameras'

const initialState = {
    isFetching: false,
    error: null,
    items: [],
    favorites: [],
    nextPage: null
}

export function cameras(state=initialState, action) {
    switch (action.type) {
        case REQUEST_CAMERAS:
            return {
                ...state,
                isFetching: true
            }
        case RECEIVE_CAMERAS:
            return {
                ...state,
                items: [...state.items, ...action.payload.items],
                nextPage: action.payload.nextPage,
                isFetching: false,
                error: null
            }
        case CAMERAS_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload
            }
        case ADD_FAVORITE:
            _.remove(
                state.items,
                {
                    id: action.payload.id,
                    server: action.payload.server
                }
            )

            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            }
        case ADD_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites, ...action.payload]
            }
        case REMOVE_FAVORITE:
            _.remove(
                state.favorites,
                {
                    id: action.payload.id,
                    server: action.payload.server
                }
            )

            return {
                ...state,
                items: [...state.items, action.payload]
            }
        default:
            return state
  }
}
