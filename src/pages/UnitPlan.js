import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {Select} from '@rmwc/select';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/select/dist/mdc.select.css';
import i18n from '../i18n';
import {UnitplanAPI} from '../api/Unitplan';
import {SubjectsAPI} from '../api/Subjects';
import TabControls from '../components/TabControls';
import UnitPlanRow from '../components/UnitPlanRow';

export default class UnitPlan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rawunitplan: [],
			unitplan: [],
			weekday: 0,
			chooserOpen: false,
			chooserList: [
				{
					lesson: '',
					teacher: '',
					room: ''
				}
			],
			chooserDay: 0,
			chooserLesson: 0,
			chooserSelect: 0
		};
		this.overwriteUnitPlan = this.overwriteUnitPlan.bind(this);
	}

	componentDidMount() {
		let day = new Date().getDay();
		if (day === 0 || day === 6) {
			day = 1;
		}
		day--;
		this.setState({weekday: day});
		if (cookie.load('grade') !== undefined && cookie.load('grade') !== '') {
			UnitplanAPI.get().then(json => {
				this.setState({rawunitplan: json});
				this.overwriteUnitPlan(json);
			}).catch(console.error);
		}
	}

	overwriteUnitPlan(unitplan) {
		const grade = cookie.load('grade');
		unitplan = unitplan.map(day => {
			day.lessons = day.lessons.filter((subjects, i) => {
				return subjects.length > 0 || i == 5;
			}).map((subjects, j) => {
				subjects = subjects.filter(subject => subject !== undefined).map(subject => {
					subject.lesson = SubjectsAPI.getSubject(subject.lesson);
					return subject;
				});
				if (j !== 5 && (grade === 'EF' || grade === 'Q1' || grade === 'Q2')) {
					if (subjects[subjects.length - 1].lesson !== i18n.t('unitplan_free_lesson')) {
						subjects.push({
							lesson: i18n.t('unitplan_free_lesson'),
							teacher: '',
							room: ''
						});
					}
				}
				return subjects;
			});
			if (day.lessons.length <= 6) {
				day.lessons.pop();
			}
			return day;
		});
		this.setState({unitplan});
	}

	render() {
		return (
			<div>
				{this.state.unitplan.map((day, i) => {
					return (
						<div
							key={i}
							style={{display: (this.state.weekday === i ? 'block' : 'none')}}>
							<TabControls
								name={day.name}
								changeWeekday={change => {
									if (this.state.weekday === 4 && change === +1) {
										this.setState({weekday: 0});
										return;
									}
									if (this.state.weekday === 0 && change === -1) {
										this.setState({weekday: 4});
										return;
									}
									this.setState({
										weekday: this.state.weekday + change
									})
								}}/>
							{day.lessons.map((subjects, j) => {
								let select = 0;
								if (cookie.load('choice:' + cookie.load('grade') + ':' + i + ':' + j) !== undefined && cookie.load('choice:' + cookie.load('grade') + ':' + i + ':' + j) !== '') {
									select = parseInt(cookie.load('choice:' + cookie.load('grade') + ':' + i + ':' + j));
								}
								if (j === 5) {
									subjects[0] = {
										lesson: i18n.t('unitplan_lunch_break'),
										teacher: '',
										room: ''
									}
								}
								return (<UnitPlanRow
									key={j}
									j={j}
									i={i}
									select={select}
									subjects={subjects}
									day={day}
									processNotification={data => this.props.processNotification(data)}
									updateState={state => this.setState(state)}/>);
							})}
						</div>
					);
				})}
				<Dialog
					open={this.state.chooserOpen}
					onClose={evt => {
						this.setState({chooserOpen: false});
						if (evt.detail.action === 'submit') {
							if (isNaN(this.state.chooserSelect)) {
								return;
							}
							if (typeof this.state.chooserSelect === 'string') {
								this.setState({chooserSelect: parseInt(this.state.chooserSelect)});
							} else {
								this.setState({chooserSelect: this.state.chooserSelect - 1});
							}
							if (this.state.chooserSelect === -1) {
								return;
							}
							cookie.save('choice:' + cookie.load('grade') + ':' + this.state.chooserDay + ':' + this.state.chooserLesson, this.state.chooserSelect, {expires: new Date(Infinity)});
							this.setState({
								chooserList: [
									{
										lesson: '',
										teacher: '',
										room: ''
									}
								],
								chooserDay: 0,
								chooserLesson: 0,
								chooserSelect: 0
							});
							this.overwriteUnitPlan(JSON.parse(JSON.stringify(this.state.rawunitplan)));
						}
					}}>
					<DialogTitle>{i18n.t('dialog_subject_select_title')}</DialogTitle>
					<DialogContent>
						<Select
							style={{width: '90%'}}
							required
							label={i18n.t('dialog_subject_select_text')}
							placeholder=''
							onChange={evt => this.setState({chooserSelect: evt.currentTarget.value})}
							options={this.state.chooserList.map((subject, i) => ({
								label: subject.lesson + ' ' + subject.teacher + ' ' + subject.room,
								value: i
							}))}/>
					</DialogContent>
					<DialogActions>
						<DialogButton action='cancel'>{i18n.t('dialog_subject_select_cancel')}</DialogButton>
						<DialogButton action='submit' isDefaultAction>{i18n.t('dialog_subject_select_submit')}</DialogButton>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}