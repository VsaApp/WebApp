import React, {Component} from 'react';

export default class TeacherRow extends Component {
	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '15% 15% 70%',
					paddingBottom: (!this.props.i !== this.props.changes.length - 1 ? 5 : 0),
					paddingTop: 5,
					borderBottom: (this.props.i !== this.props.teachersCount - 1 ? '1px solid gray' : 'none')
				}}
				onClick={this.props.onClick}>
				<p style={{margin: 0, fontWeight: 'bold'}}>{this.props.teacher.shortName}</p>
				<p style={{margin: 0}}>{(this.props.teacher.gender === 'female' ? 'F' : 'H') + 'r. '}</p>
				<p style={{margin: 0}}>{this.props.teacher.longName}</p>
			</div>
		);
	}
}