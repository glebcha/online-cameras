import _ from 'lodash'
import configureStore from '../../store/configureStore'
import { addFavorite, receiveCameras } from '../../actions/CamerasActions'

describe('Receive cameras action', () => {

    it('should fetch cameras without error', () => {
        const store = configureStore({})

        return store.dispatch(receiveCameras())
        .then(res => {
            const state = store.getState()
            const items = _.get(state, 'cameras.items')
            const error = _.get(state, 'cameras.error')

            expect(items).not.toHaveLength(0)
            expect(error).toBeNull()
        })
    })

    it('should add favorite', () => {
        const store = configureStore({})
        const item = {
            id: 0,
            server: 'server'
        }

        return store.dispatch(addFavorite(item))
        .then(res => {
            const state = store.getState()
            const favorites = _.get(state, 'cameras.favorites')

            expect(favorites).toContainEqual(item)
        })
    })

})
