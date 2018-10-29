import React, {Component} from 'react';
import Icon from '@mdi/react';
import {mdiChevronLeft, mdiChevronRight} from '@mdi/js';

export default class TabControls extends Component {
	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '10% 80% 10%',
					alignItems: 'end',
					height: 30
				}}>
				<div
					style={{
						width: '100%',
						textAlign: 'left'
					}}
					onClick={() => {
						this.props.changeWeekday(-1);
					}}>
					<Icon path={mdiChevronLeft} size={1.25} color='black'/>
				</div>
				<p
					style={{
						textAlign: 'center',
						fontSize: 25,
						margin: 0
					}}>{this.props.name}</p>
				<div
					style={{
						width: '100%',
						textAlign: 'right'
					}}
					onClick={() => {
						this.props.changeWeekday(+1);
					}}>
					<Icon path={mdiChevronRight} size={1.25} color='black'/>
				</div>
			</div>
		);
	}
}