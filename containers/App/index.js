import React, { Component, PropTypes } from 'react'
import CamerasList from '../CamerasList'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/core.less'
import './App.less'

export default class App extends Component {
    render() {

        return (
            <div className='online_cameras'>
                <Header />
                <CamerasList />
                <Footer />
            </div>
        )
    }
}
