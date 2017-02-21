import React, { Component, PropTypes } from 'react'
import { API_LIVE } from '../../constants/api'
import { isFunction, trimString, xhr, hash } from '../../utils/helpers'
import { addFavorite, removeFavorite } from '../../actions/CamerasActions'
import Image from '../Image'
import Checkbox from '../Checkbox'
import './Camera.less'

export default class Camera extends Component {
    static propTypes = {
        item: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string,
            description: React.PropTypes.string.isRequired,
            total_views: React.PropTypes.number.isRequired,
            online: React.PropTypes.bool,
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            server: React.PropTypes.string.isRequired
        }),
        dispatch: React.PropTypes.func.isRequired
    }

    state = {
        opened: false,
        checked: false,
        image: null,
        error: false,
        isRefreshing: false
    }

    get imageURL() {
        const { item } = this.props
        const { id, server } = item

        return `${ API_LIVE }?server=${ server }&camera=${ id }`
    }

    componentWillMount() {
        this.getPreview(true)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    getPreview = (initial=false) => {
        this.setState({ isRefreshing: true })

        xhr({url: this.imageURL, responseType: 'blob'})
        .then(res => {
            const blob = URL.createObjectURL(res.result)
            this.setState(
                { image: blob, error: false, isRefreshing: false },
                () => !initial && this.imageUpdater()
            )
        })
        .catch(err => this.setState({ error: true, isRefreshing: false }))
    }

    refreshPreview = (e) => {
        e.preventDefault

        this.getPreview()
    }

    expandPreview = () => {
        const { opened } = this.state

        if(!opened) {
            this.setState(
                { opened: true },
                () => this.imageUpdater()
            )
        }
    }

    minimizePreview = () => {
        clearTimeout(this.timeout)
        this.setState({ opened: false })
    }

    imageUpdater = () => {
        this.timeout = setTimeout(() => this.getPreview(), 10000)
    }

    setFavorite = (checked) => {
        const { item, saveLocalFavorites, dispatch } = this.props
        const isValidCallback = saveLocalFavorites
                                &&
                                isFunction(saveLocalFavorites)


        dispatch(
            checked
            ?
            addFavorite(item)
            :
            removeFavorite(item)
        )
        .then(res => isValidCallback && saveLocalFavorites())
    }

    render() {
        const { opened, image, error, isRefreshing } = this.state
        const { item, isFavorite } = this.props
        const {
            id,
            name,
            description,
            total_views,
            online,
            width,
            height,
            server
        } = item
        const imageSize = opened ? 'contain' : 'cover'
        const itemDescription = description
                                ?
                                trimString(description, 70)
                                :
                                'No description'

        return (
            <article className={ `online_cameras__item ${
                    opened ? 'opened' : ''
            }` }>
                <aside
                    className={ `${ opened ? 'col-12' : 'col-3' }` }
                    onClick={ this.expandPreview }
                >
                    {opened &&
                        <span
                            className='preview_close'
                            onClick={ this.minimizePreview }
                        />
                    }
                    <Image
                        src={ image }
                        size={ imageSize }
                        className='item_image'
                    />
                {opened && error &&
                    <div className='item_image__error'>
                        <h3>Camera is offline</h3>
                        <button
                            disabled={ isRefreshing }
                            onClick={ this.refreshPreview }
                        >
                            { isRefreshing ? 'Refreshing...' : 'Refresh' }
                        </button>
                    </div>
                }
                </aside>
                <section className={ `${ opened ? 'col-12' : 'col-9' }` }>
                    <div className='col-10'>
                        <h3>{ itemDescription }</h3>
                        <p>{ `Total views: ${ total_views }` }</p>
                    </div>
                    <div className='col-2 text-right'>
                        <Checkbox
                            checked={ isFavorite }
                            onChange={ this.setFavorite }
                        />
                    </div>
                </section>
            </article>
        )
    }
}
