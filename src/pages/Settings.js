import React, {Component} from 'react';
import {LoginAPI} from '../api/Login';
import i18n from '../i18n';

export default class Settings extends Component {

	render() {
		return (
			<div>
				<div onClick={() => LoginAPI.logout()}>
					<h2 style={{margin: 0}}>{i18n.t('settings_logout_title')}</h2>
					<h3 style={{margin: 0}}>{i18n.t('settings_logout_text')}</h3>
				</div>
			</div>
		);
	}
}