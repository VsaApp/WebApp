import React, {Component} from 'react';

export default class ReplacementPlanRow extends Component {
	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateRows: '50% 50%',
					gridGap: 2.5,
					paddingBottom: (!this.props.j !== this.props.changes.length - 1 ? 5 : 0),
					paddingTop: 5,
					borderBottom: (this.props.j !== this.props.changes.length - 1 ? '1px solid gray' : 'none'),
					color: (this.props.change.changed.info.includes('Klausur') ? 'red' : 'black'),
					fontWeight: (this.props.change.changed.info.includes('Klausur') ? 'bold' : 'none')
				}}>
				<div
					style={{display: 'grid', gridTemplateColumns: '15% 35.8% 35.8% 15%'}}>
					<p style={{margin: 0}}>{this.props.change.unit}</p>
					<p style={{margin: 0}}>{this.props.change.lesson}</p>
					<p
						style={{margin: 0}}
						onClick={() => {
							if (this.props.change.changed.teacher !== '') {
								this.props.processNotification({tab: 2, shortName: this.props.change.teacher})
							}
						}}>{this.props.change.teacher}</p>
					<p style={{margin: 0, textAlign: 'right'}}>{this.props.change.room}</p>
				</div>
				<div
					style={{display: 'grid', gridTemplateColumns: '15% 35.8% 35.8% 15%'}}>
					<div/>
					<p style={{margin: 0, fontWeight: 'bold'}}>{this.props.change.changed.info}</p>
					<p
						style={{margin: 0, fontWeight: 'bold'}}
						onClick={() => {
							if (this.props.change.changed.teacher !== '') {
								this.props.processNotification({tab: 2, shortName: this.props.change.changed.teacher})
							}
						}}>{this.props.change.changed.teacher}</p>
					<p
						style={{
							margin: 0,
							textAlign: 'right',
							fontWeight: 'bold'
						}}>{this.props.change.changed.room}</p>
				</div>
			</div>
		);
	}
}