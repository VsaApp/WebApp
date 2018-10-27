import React, {Component} from 'react';
import {TimesAPI} from '../api/Lessontimes';

export default class UnitPlanRow extends Component {
	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateRows: '50% 50%',
					gridGap: 2.5,
					paddingBottom: 5,
					paddingTop: 5,
					borderBottom: (!this.props.last ? '1px solid gray' : 'none')
				}}
				onClick={() => {
					if (this.props.subjects.length > 1) {
						this.props.onClick({
							chooserList: this.props.subjects,
							chooserDay: this.props.i,
							chooserLesson: this.props.j,
							chooserOpen: true,
							chooserData: this.props.subjects[0],
							chooserSelect: this.props.subjects[0].lesson + ' ' + this.props.subjects[0].teacher + ' ' + this.props.subjects[0].room
						});
					}
				}}>
				<div
					style={{display: 'grid', gridTemplateColumns: '15% 70% 15%'}}>
					<p style={{margin: 0}}>{this.props.j + 1}</p>
					<b style={{
						margin: 0,
						color: (this.props.subjects.length > 1 ? 'var(--mdc-theme-primary)' : 'black')
					}}>{this.props.subjects[this.props.select].lesson}</b>
					<p
						style={{margin: 0, textAlign: 'right'}}
						onClick={() => {
							this.props.processNotification({tab: 2, shortName: this.props.subjects[this.props.select].teacher});
						}}>{this.props.subjects[this.props.select].teacher}</p>
				</div>
				<div style={{
					marginTop: 1,
					display: 'grid',
					gridTemplateColumns: '15% 55% 30%'
				}}>
					<div/>
					{TimesAPI[this.props.j]}
					<b style={{margin: 0, textAlign: 'right'}}>
						{this.props.j !== 5 ? this.props.subjects[this.props.select].room : <br/>}
					</b>
				</div>
			</div>
		);
	}
}