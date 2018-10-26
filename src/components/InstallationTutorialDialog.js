import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';
import i18n from '../i18n';

export default class InstallationTutorialDialog extends Component {
	render() {
		return (
			<Dialog
				open={this.props.show}
				onClose={() => this.props.onClose()}>
				<DialogTitle>{i18n.t('dialog_installation_tutorial_title')}</DialogTitle>
				<DialogContent>{i18n.t('dialog_installation_tutorial_text')}</DialogContent>
				<DialogActions>
					<DialogButton action='accept' isDefaultAction>OK</DialogButton>
				</DialogActions>
			</Dialog>
		);
	}
}