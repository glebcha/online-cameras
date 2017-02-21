import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { receiveCameras } from '../../actions/CamerasActions'
import './Footer.less'

function mapStateToProps(state) {
    const { cameras: { nextPage } } = state
    return { nextPage }
}

@connect(mapStateToProps)
export default class Footer extends Component {
    static propTypes = {
        nextPage: React.PropTypes.string
    }

    toTop = (e) => {
        e.preventDefault()
        document.querySelector('.online_cameras__list').scrollTop = 0
    }

    loadMore = (e) => {
        const { nextPage, dispatch } = this.props

        e.preventDefault()
        dispatch(receiveCameras({params: `seed=${ nextPage }`}))
    }

    render() {
        return (
            <footer>
                <a
                    href='#'
                    className='footer_btn'
                    onClick={ this.toTop }
                >
                    Top
                </a>
                <a
                    href='#'
                    className='footer_btn'
                    onClick={ this.loadMore }
                >
                    More
                </a>
            </footer>
        )
    }
}
