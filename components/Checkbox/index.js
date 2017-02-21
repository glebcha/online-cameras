import React, { Component, PropTypes } from 'react'
import { hash, isFunction } from '../../utils/helpers'
import './Checkbox.less'

export default class Checkbox extends Component {

    defaultId = `Checkbox-${ hash() }`

    onChange = (e) => {
        const { onChange } = this.props
        const isValidCallback = onChange && isFunction(onChange)

        if(isValidCallback) {
            onChange(this.refs.checkbox.checked)
        }
    }

    render() {
        const {
            id = this.defaultId,
            children,
            checked
        } = this.props

        return (
            <span className='styled-checkbox'>
                <input
                    ref='checkbox'
                    id={ id }
                    type='checkbox'
                    checked={ checked }
                    onChange={ this.onChange }
                />

                <label htmlFor={ id }>
                    { children }
                </label>
            </span>
        )
    }
}
