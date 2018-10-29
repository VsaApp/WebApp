import React, {Component} from 'react';

export default class ReplacementPlanRow extends Component {

	transformTime(time) {
		if (typeof time === 'string') {
			if (time === '') {
				return '';
			}
			if (!time.includes('.') && !time.includes(':')) {
				return time + ':00';
			} else {
				return time.replace('.', ':');
			}
		} else {
			if (time.start === '' || time.end === '') {
				return '';
			}
			if (!time.start.includes('.') && !time.start.includes(':')) {
				time.start = time.start + ':00';
			}
			if (!time.end.includes('.') && !time.end.includes(':')) {
				time.end = time.end + ':00';
			}
			return time.start.replace('.', ':') + ' - ' + time.end.replace('.', ':');
		}
	}

	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateRows: '50% 50%',
					gridGap: 2.5,
					paddingBottom: (!this.props.j !== this.props.menuCount - 1 ? 5 : 0),
					paddingTop: 5,
					borderBottom: (this.props.j !== this.props.menuCount - 1 ? '1px solid gray' : 'none')
				}}>
				<div style={{display: 'grid', gridTemplateColumns: '100%'}}>
					<p style={{margin: 0, fontWeight: 'bold'}}>{this.props.menu.food}</p>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: '75% 25%'}}>
					<p style={{margin: 0, color: 'gray'}}>{this.transformTime(this.props.menu.time)}</p>
					<p style={{margin: 0, textAlign: 'right'}}>{this.props.menu.price.toFixed(2) + ' €'}</p>
				</div>
			</div>
		);
	}
}