import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {TextField} from '@rmwc/textfield';
import {Select} from '@rmwc/select';
import {Checkbox} from '@rmwc/checkbox';
import {CircularProgress} from '@rmwc/circular-progress';
import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/select/dist/mdc.select.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/checkbox/dist/mdc.checkbox.css';
import '@material/form-field/dist/mdc.form-field.css';
import '@rmwc/circular-progress/circular-progress.css';
import cookie from 'react-cookies';
import i18n from '../i18n';
import {LoginAPI} from '../api/Login';
import {GradesAPI} from '../api/Grades';
import {FirebaseAPI} from '../api/Firebase';
import {TeacherAPI} from "../api/Teachers";

export default class LoginDialog extends Component {

	constructor(props) {
		super(props);
		const grades = JSON.parse(JSON.stringify(GradesAPI));
		grades.shift();
		grades.pop();
		this.state = {
			showLogin: this.props.show,
			loginInvalid: false,
			loginUsername: '',
			loginPassword: '',
			loginGrade: GradesAPI[0],
			selectGrades: grades,
			teacherChecked: false,
			loggingIn: false
		};
	}

	render() {
		return (
			<div>
				<CircularProgress
					size={72}
					style={{
						display: (this.state.loggingIn ? 'block' : 'none'),
						margin: 'auto',
						top: window.innerWidth - 72
					}}/>
				<Dialog
					open={this.state.showLogin}
					onClose={evt => {
						if (evt.detail.action === 'accept') {
							this.setState({loggingIn: true, showLogin: false});
							console.log('Trying to log in...');
							if (!this.state.teacherChecked) {
								LoginAPI.login(this.state.loginUsername, this.state.loginPassword).then(correct => {
									console.log(correct);
									if (correct) {
										this.setState({loginInvalid: false});
										if (Notification.permission !== 'granted') {
											alert(i18n.t('notification_permission_not_granted'));
										}
										FirebaseAPI.subscribe(this.state.loginGrade).then(() => {
											cookie.save('username', this.state.loginUsername, {expires: new Date(Infinity)});
											cookie.save('password', this.state.loginPassword, {expires: new Date(Infinity)});
											cookie.save('grade', this.state.loginGrade, {expires: new Date(Infinity)});
											window.location.reload();
										}).catch(error => {
											console.error(error);
											this.setState({loggingIn: false});
											alert(i18n.t('notification_permission_not_granted'));
										});
									} else {
										this.setState({loginInvalid: true, loggingIn: false, showLogin: true});
									}
								}).catch(() => {
								});
							} else {
								TeacherAPI.get().then(teachers => {
									if (teachers.filter(t => t.shortName === this.state.loginUsername).length > 0) {
										this.setState({loginInvalid: false});
										if (Notification.permission !== 'granted') {
											alert(i18n.t('notification_permission_not_granted'));
										}
										FirebaseAPI.subscribe(this.state.loginUsername).then(() => {
											cookie.save('username', this.state.loginUsername, {expires: new Date(Infinity)});
											cookie.save('password', this.state.loginPassword, {expires: new Date(Infinity)});
											cookie.save('grade', this.state.loginUsername, {expires: new Date(Infinity)});
											cookie.save('teacher', true, {expires: new Date(Infinity)});
											window.location.reload();
										}).catch(error => {
											console.error(error);
											this.setState({loggingIn: false});
											alert(i18n.t('notification_permission_not_granted'));
										});
									} else {
										this.setState({loginInvalid: true, loggingIn: false, showLogin: true});
									}
								});
							}
						}
					}}>
					<DialogTitle>{i18n.t('dialog_login_title')}</DialogTitle>
					<DialogContent style={{overflowY: 'hidden'}}>
						<Checkbox
							checked={this.state.teacherChecked}
							onChange={evt => this.setState({teacherChecked: evt.target.checked})}>
							{i18n.t('dialog_login_teacher')}
						</Checkbox>
						<TextField
							style={{width: '100%'}}
							required
							invalid={this.state.loginInvalid}
							label={i18n.t('dialog_login_username')}
							onChange={evt => {
								this.setState({loginUsername: evt.currentTarget.value});
							}}/>
						<TextField
							style={{width: '100%'}}
							required
							invalid={this.state.loginInvalid}
							type='password'
							label={i18n.t('dialog_login_password')}
							onChange={evt => {
								this.setState({loginPassword: evt.currentTarget.value});
							}}/>
						<br/>
						<Select
							style={{width: '100%', display: (this.state.teacherChecked ? 'none' : 'block')}}
							required
							label={i18n.t('dialog_login_grade')}
							placeholder={GradesAPI[0]}
							onChange={evt => this.setState({loginGrade: evt.currentTarget.value})}
							options={this.state.selectGrades}/>
					</DialogContent>
					<DialogActions>
						<DialogButton action='accept' isDefaultAction>{i18n.t('dialog_login_submit')}</DialogButton>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
};