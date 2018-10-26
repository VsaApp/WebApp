import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {TextField} from '@rmwc/textfield';
import {Select} from '@rmwc/select';
import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/select/dist/mdc.select.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import cookie from 'react-cookies';
import i18n from '../i18n';
import {LoginAPI} from '../api/Login';
import {GradesAPI} from '../api/Grades';
import {FirebaseAPI} from '../api/Firebase';

export default class LoginDialog extends Component {

	constructor(props) {
		super(props);
		const grades = JSON.parse(JSON.stringify(GradesAPI));
		grades.shift();
		grades.pop();
		this.state = {
			loginInvalid: false,
			loginUsername: '',
			loginPassword: '',
			loginGrade: GradesAPI[0],
			selectGrades: grades
		};
	}

	render() {
		return (
			<Dialog
				open={this.props.show}
				onClose={evt => {
					if (evt.detail.action === 'accept') {
						console.log('Trying to log in...');
						LoginAPI.login(this.state.loginUsername, this.state.loginPassword).then(correct => {
							console.log(correct);
							if (correct) {
								this.setState({loginInvalid: false});
								this.props.onClose();
								if (Notification.permission !== 'granted') {
									alert(i18n.t('notification_permission_not_granted'));
								}
								FirebaseAPI.subscribe(this.state.loginGrade + 'test').then(() => {
									cookie.save('username', this.state.loginUsername, {expires: new Date(Infinity)});
									cookie.save('password', this.state.loginPassword, {expires: new Date(Infinity)});
									cookie.save('grade', this.state.loginGrade, {expires: new Date(Infinity)});
									window.location.reload();
								}).catch(error => {
									console.error(error);
									alert(i18n.t('notification_permission_not_granted'));
								});
							} else {
								this.setState({loginInvalid: true});
							}
						}).catch(() => {
						});
					}
				}}>
				<DialogTitle>{i18n.t('dialog_login_title')}</DialogTitle>
				<DialogContent style={{textAlign: 'center'}}>
					<TextField
						style={{width: '90%'}}
						required
						invalid={this.state.loginInvalid}
						label={i18n.t('dialog_login_username')}
						onChange={evt => {
							this.setState({loginUsername: evt.currentTarget.value});
						}}/>
					<TextField
						style={{width: '90%'}}
						required
						invalid={this.state.loginInvalid}
						type='password'
						label={i18n.t('dialog_login_password')}
						onChange={evt => {
							this.setState({loginPassword: evt.currentTarget.value});
						}}/>
					<br/>
					<Select
						style={{width: '90%'}}
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
		);
	}
}