import React, { Component, PropTypes } from 'react'
import './Loading.less'

export default class Loading extends Component {
	render() {
		const { circle } = this.props

        return (
            <div className='spinner'>
                {!circle && [...Array(3)].map((x, i) =>
                    <div key={i + 1} className='bounce' />
                )}
                {circle &&
                	<div className='progress'>
                		<div>Loading…</div>
                	</div>
               	}
            </div>
        )
    }
}
