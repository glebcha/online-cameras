import { CALL_API } from 'redux-api-middleware'
import { API_CAMERAS } from '../constants/api'
import {
    REQUEST_CAMERAS,
    RECEIVE_CAMERAS,
    CAMERAS_ERROR,
    ADD_FAVORITE,
    ADD_FAVORITES,
    REMOVE_FAVORITE
} from '../constants/cameras'

const defaultOptions = {
    limit: 10,
    params: ''
}

export function receiveCameras(options=defaultOptions) {
    const { limit=10, params='' } = options

    return {
        [CALL_API]: {
            endpoint: `${ API_CAMERAS }?limit=${ limit }&${ params }`,
            method: 'GET',
            types: [
                REQUEST_CAMERAS,
                {
                    type: RECEIVE_CAMERAS,
                    payload: (action, state, res) => {
                        const contentType = res.headers.get('Content-Type')

                        if (contentType && ~contentType.indexOf('json')) {
                            return res.json().then(json => {
                                const { cameras, seeds } = json.response
                                const nextPage = seeds && seeds.next
                                const normalizedCameras = cameras && cameras.map(item => {
                                    const {
                                        camera,
                                        camera_name,
                                        description,
                                        total_views,
                                        online,
                                        width,
                                        height,
                                        server
                                    } = item

                                    return {
                                        id: item.camera,
                                        name: item.camera_name,
                                        description,
                                        total_views,
                                        online,
                                        width,
                                        height,
                                        server
                                    }
                                })
                                const items = normalizedCameras || []

                                return { items, nextPage }
                            })
                        }
                    }
                },
                CAMERAS_ERROR
            ]
        }
    }
}

export function addFavorite(item) {
    return {
        type: ADD_FAVORITE,
        payload: item
    }
}

export function removeFavorite(item) {
    return {
        type: REMOVE_FAVORITE,
        payload: item
    }
}

export function addFavorites(items) {
    return {
        type: ADD_FAVORITES,
        payload: items
    }
}
