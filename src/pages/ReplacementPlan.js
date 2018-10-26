import React, {Component} from 'react';
import cookie from 'react-cookies';
import i18n from '../i18n';
import TabControls from '../components/TabControls';
import {ReplacementplanAPI} from '../api/Replacementplan';
import {SubjectsAPI} from '../api/Subjects';
import ReplacementPlanRow from '../components/ReplacementPlanRow';

export default class ReplacementPlan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			replacementplanToday: {},
			replacementplanTomorrow: {},
			showToday: true,
			data: {}
		}
	}

	selectTab() {
		if (JSON.stringify(this.state.data) !== '{}') {
			if (this.state.showToday) {
				if (this.state.replacementplanToday.weekday !== this.state.data.day) {
					this.setState({
						showToday: !this.state.showToday
					});
				}
			} else {
				if (this.state.replacementplanTomorrow.weekday !== this.state.data.day) {
					this.setState({
						showToday: !this.state.showToday
					});
				}
			}
		}
	}

	componentDidMount() {
		let got = 0;
		if (cookie.load('grade') !== undefined && cookie.load('grade') !== '') {
			ReplacementplanAPI.get(true).then(json => {
				this.setState({
					replacementplanToday: this.overwriteReplacementPlan(json)
				});
				got++;
				if (got === 2) {
					this.selectTab();
				}
			}).catch(console.error);
			ReplacementplanAPI.get(false).then(json => {
				this.setState({
					replacementplanTomorrow: this.overwriteReplacementPlan(json)
				});
				got++;
				if (got === 2) {
					this.selectTab();
				}
			}).catch(console.error);
		}
	}

	overwriteReplacementPlan(replacementplan) {
		replacementplan.changes = replacementplan.changes.map(change => {
			change.lesson = SubjectsAPI.getSubject(change.lesson);
			return change;
		});
		return replacementplan;
	}

	render() {
		return (
			<div>
				{[this.state.replacementplanToday, this.state.replacementplanTomorrow].map((replacementplan, i) => {
					const today = i === 0;
					if (JSON.stringify(replacementplan) !== '{}') {
						return (
							<div
								key={i}
								style={{display: ((today && this.state.showToday) || (!today && !this.state.showToday) ? 'block' : 'none')}}>
								<TabControls
									name={replacementplan.weekday}
									changeWeekday={() => this.setState({showToday: !this.state.showToday})}/>
								<p style={{textAlign: 'center', margin: 0}}>{replacementplan.date}</p>
								<p
									style={{
										textAlign: 'center',
										margin: 0,
										fontSize: 12
									}}>{'(' + i18n.t('replacementplan_last_updated') + ': ' + replacementplan.update + ' ' + replacementplan.time + ')'}</p>
								<div>
									{replacementplan.changes.map((change, j) => {
										return (<ReplacementPlanRow
											key={j}
											j={j}
											change={change}
											changes={replacementplan.changes}
											processNotification={data => this.props.processNotification(data)}/>);
									})}
								</div>
							</div>
						);
					} else {
						return '';
					}
				})}
			</div>
		);
	}
}