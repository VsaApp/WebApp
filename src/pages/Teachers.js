import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {Button} from '@rmwc/button';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';
import i18n from '../i18n';
import {TeacherAPI} from '../api/Teachers';
import {SubjectsAPI} from '../api/Subjects';
import TeacherRow from '../components/TeacherRow';

export default class Teachers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			teachers: [],
			dialogOpen: false,
			dialogData: {
				longName: '',
				shortName: '',
				subjects: [],
				gender: ''
			},
			data: {}
		};
	}

	componentDidMount() {
		TeacherAPI.get().then(teachers => {
			this.setState({teachers: this.overwriteTeachers(teachers)});
			if (JSON.stringify(this.state.data) !== '{}') {
				this.setState({
					dialogOpen: true,
					dialogData: this.state.teachers.filter(teacher => teacher.shortName === this.state.data.shortName)[0]
				});
			}
		});
	}

	overwriteTeachers(teachers) {
		teachers = teachers.map(teacher => {
			teacher.subjects = teacher.subjects.map(subject => SubjectsAPI.getSubject(subject));
			if (teacher.longName.endsWith('von')) {
				teacher.longName = 'von ' + teacher.longName.slice(0, -3).trim();
			}
			return teacher;
		});
		return teachers.sort((a, b) => {
			if (a.shortName < b.shortName) {
				return -1;
			}
			if (a.shortName > b.shortName) {
				return 1;
			}
			return 0;
		});
	}

	render() {
		return (
			<div>
				{this.state.teachers.map((teacher, i) => {
					return (<TeacherRow
						key={i}
						i={i}
						teachersCount={this.state.teachers.length}
						teacher={teacher}
						onClick={() => {
							this.setState({dialogOpen: true, dialogData: teacher});
						}}/>);
				})}
				<Dialog
					open={this.state.dialogOpen}
					onClose={() => this.setState({dialogOpen: false})}>
					<DialogTitle>{(this.state.dialogData.gender === 'female' ? 'F' : 'H') + 'r. ' + this.state.dialogData.longName}</DialogTitle>
					<DialogContent>
						<p
							style={{fontWeight: 'bold'}}>{i18n.t('dialog_teacher_short_name') + ': ' + this.state.dialogData.shortName}</p>
						<p style={{marginBottom: 0, fontWeight: 'bold'}}>{i18n.t('dialog_teacher_subjects') + ':'}</p>
						{this.state.dialogData.subjects.map((subject, j) => {
							return (
								<p style={{
									margin: 0
								}} key={j}>{subject}</p>
							);
						})}
						<Button
							style={{marginTop: 5}}
							onClick={() => {
								const linkElement = document.createElement('a');
								linkElement.style.visibility = 'hidden';
								linkElement.style.position = 'absolute';
								linkElement.href = 'mailto:' + this.state.dialogData.shortName + '@viktoriaschule-aachen.de';
								if (!window.matchMedia('(display-mode: standalone)').matches) {
									linkElement.target = '_blank';
								}
								document.body.appendChild(linkElement);
								linkElement.click();
							}}>{i18n.t('dialog_teacher_send_mail')}</Button>
					</DialogContent>
					<DialogActions>
						<DialogButton action='close'>{i18n.t('dialog_teacher_cancel')}</DialogButton>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}