import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {Select} from '@rmwc/select';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/select/dist/mdc.select.css';
import i18n from '../i18n';
import {UnitplanAPI} from '../api/Unitplan';
import {SubjectsAPI} from '../api/Subjects';
import {StorageAPI} from '../api/Storage';
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
			chooserSelect: 0,
			chooserData: {
				teacher: '',
				lesson: '',
				room: ''
			}
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
		if (StorageAPI.get('grade') !== undefined && StorageAPI.get('grade') !== '') {
			UnitplanAPI.get().then(json => {
				this.setState({rawunitplan: json});
				this.overwriteUnitPlan(json);
			}).catch(console.error);
		}
	}

	overwriteUnitPlan(unitplan) {
		const grade = StorageAPI.get('grade');
		unitplan = unitplan.map(day => {
			day.lessons = day.lessons.map((subjects, j) => {
				subjects = subjects.filter(subject => subject !== undefined).map(subject => {
					subject.lesson = SubjectsAPI.getSubject(subject.lesson);
					return subject;
				});
				if (subjects.length === 0) {
					subjects.push({
						lesson: i18n.t('unitplan_free_lesson'),
						teacher: '',
						room: ''
					});
				}
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
			day.lessons = day.lessons.reduceRight((result, a) =>
					(result.length === 0 && a[0].lesson === i18n.t('unitplan_free_lesson') ? result : [a].concat(result)),
				[]);
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
								let last = false;
								let select = 0;
								if (subjects.length > 0) {
									let singleChoice = StorageAPI.get('choice:' + StorageAPI.get('grade') + ':' + i + ':' + j);
									if (singleChoice !== undefined && singleChoice !== '') {
										select = parseInt(singleChoice);
									}
									if ('block' in subjects[0]) {
										let blockChoice = StorageAPI.get('choice:' + subjects[0].block);
										if (blockChoice !== undefined && blockChoice !== '') {
											select = parseInt(blockChoice);
										}
									}
								}
								if (j === 5) {
									if (day.lessons.length > 6) {
										subjects[0] = {
											lesson: i18n.t('unitplan_lunch_break'),
											teacher: '',
											room: ''
										}
									} else {
										return '';
									}
								}
								if (day.lessons.length === 6) {
									if (j === day.lessons.length - 2) {
										last = true;
									}
								}
								if (j === day.lessons.length - 1) {
									last = true;
								}
								if (subjects.length > 0) {
									return (<UnitPlanRow
										key={j}
										j={j}
										i={i}
										select={select}
										subjects={subjects}
										day={day}
										last={last}
										processNotification={data => this.props.processNotification(data)}
										onClick={state => this.setState(state)}/>);
								} else {
									return (<UnitPlanRow
										key={j}
										j={j}
										i={i}
										select={select}
										subjects={[{lesson: 'Freistunde', room: ' ', teacher: ' '}]}
										day={day}
										last={last}
										processNotification={data => this.props.processNotification(data)}
										onClick={state => this.setState(state)}/>);
								}
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
							console.log(this.state.chooserData, this.state.chooserSelect);
							if (!('block' in this.state.chooserData)) {
								StorageAPI.set('choice:' + StorageAPI.get('grade') + ':' + this.state.chooserDay + ':' + this.state.chooserLesson, this.state.chooserSelect);
							} else {
								StorageAPI.set('choice:' + this.state.chooserData.block, this.state.chooserSelect);
							}
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