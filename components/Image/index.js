import React, {Component} from 'react';

export default class Image extends Component {
    render() {
        const {
            size='cover',
            src,
            height,
            width,
            style={},
            className
        } = this.props

        const result = {
            backgroundImage: `url(${ src || '' })`,
            backgroundSize: size,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }

        return <div
                    className={ className }
                    style={{ ...result, ...style, width, height }}
                />
    }
}
