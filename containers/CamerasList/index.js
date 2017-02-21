import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Camera from '../../components/Camera'
import Loading from '../../components/Loading'
import { receiveCameras, addFavorites } from '../../actions/CamerasActions'
import './CamerasList.less'

function mapStateToProps(state) {
    const { cameras } = state
    return { cameras }
}

@connect(mapStateToProps)
export default class CamerasList extends Component {

    static propTypes = {
        nextPage: React.PropTypes.string,
        cameras: React.PropTypes.shape({
          items: React.PropTypes.arrayOf(React.PropTypes.object),
          favorites: React.PropTypes.arrayOf(React.PropTypes.object),
          isFetching: React.PropTypes.bool,
          error: React.PropTypes.object
        })
    }

    componentWillMount() {
        const { dispatch } = this.props
        const savedCameras = localStorage.getItem('starredCameras')
        const cameras = savedCameras && JSON.parse(savedCameras)

        if(savedCameras) {
            dispatch(addFavorites(JSON.parse(savedCameras)))
        }

        dispatch(receiveCameras())
    }

    saveLocalFavorites = () => {
        const { cameras: { favorites } } = this.props

        localStorage.setItem('starredCameras', JSON.stringify(favorites))
    }

    render() {
        const {
            cameras: {
                items,
                favorites,
                isFetching,
                error
            },
            dispatch
        } = this.props

        return (
            <main className='online_cameras__list'>
                {favorites && favorites.length > 0 && favorites.map(favorite =>
                    <Camera
                        key={ `${ favorite.id }${ favorite.server }` }
                        item={ favorite }
                        isFavorite={ true }
                        dispatch={ dispatch }
                        saveLocalFavorites={ this.saveLocalFavorites }
                    />
                )}
                {items && items.length > 0 && items.map(item =>
                    <Camera
                        key={ `${ item.id }${ item.server }` }
                        item={ item }
                        dispatch={ dispatch }
                        saveLocalFavorites={ this.saveLocalFavorites }
                    />
                )}
                { isFetching && <Loading /> }
            </main>
        )
    }
}
