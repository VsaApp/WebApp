import React, {Component} from 'react';
import {Dialog, DialogActions, DialogButton, DialogContent, DialogTitle} from '@rmwc/dialog';
import {TextField} from '@rmwc/textfield';
import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@rmwc/circular-progress/circular-progress.css';
import i18n from '../i18n';
import {StorageAPI} from '../api/Storage';
import {CafetoriaAPI} from '../api/Cafetoria';
import TabControls from '../components/TabControls';
import CafetoriaRow from '../components/CafetoriaRow';

export default class Cafetoria extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			pin: '',
			showLogin: false,
			loginInvalid: false,
			menues: {saldo: 0, menues: [], extra: {}, snack: {}},
			weekday: 0
		};
		this.loadMenues = this.loadMenues.bind(this);
	}

	componentWillMount() {
		this.setState({
			id: StorageAPI.get('cafetoria_id') || '',
			pin: StorageAPI.get('cafetoria_pin') || '',
			showLogin: StorageAPI.get('cafetoria_id') === undefined || StorageAPI.get('cafetoria_pin') === undefined
		});
		setTimeout(() => {
			if (!this.state.showLogin) {
				this.loadMenues();
			}
		}, 100);
	}

	componentDidMount() {
		let day = new Date().getDay();
		if (day === 0 || day === 6) {
			day = 1;
		}
		day--;
		this.setState({weekday: day});
	}

	loadMenues() {
		CafetoriaAPI.get(this.state.id, this.state.pin).then(menues => {
			console.log(menues);
			if (menues.error === null) {
				StorageAPI.set('cafetoria_id', this.state.id);
				StorageAPI.set('cafetoria_pin', this.state.pin);
				this.setState({menues});
			} else {
				this.setState({showLogin: true, loginInvalid: true});
			}
		});
	}

	render() {
		return (
			<div>
				{this.state.menues.menues.map((day, i) => {
					return (
						<div
							key={i}
							style={{display: (this.state.weekday === i ? 'block' : 'none')}}>
							<TabControls
								name={day.weekday}
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
							<p style={{textAlign: 'center', margin: 0}}>{day.date}</p>
							{this.state.menues.saldo !== null ?
								<p
									style={{textAlign: 'center', margin: 0, marginTop: 5}}>{this.state.menues.saldo.toFixed(2) + ' €'}</p>
								: ''}
							{day.menues.concat([day.extra, day.snack]).filter(menu => menu.food !== '').map((menu, j, arr) => {
								return (
									<CafetoriaRow
										key={j}
										j={j}
										menu={menu}
										menuCount={arr.length}
									/>
								);
							})}
						</div>
					);
				})}
				<Dialog
					open={this.state.showLogin}
					onClose={evt => {
						if (evt.detail.action === 'accept') {
							console.log('Trying to log in...');
							this.setState({
								showLogin: false,
								loginInvalid: false
							});
							this.loadMenues();
						}
					}}>
					<DialogTitle>{i18n.t('dialog_cafetoria_title')}</DialogTitle>
					<DialogContent style={{overflowY: 'hidden'}}>
						{i18n.t('dialog_cafetoria_text')}
						< TextField
							style={{width: '100%'}}
							required
							invalid={this.state.loginInvalid}
							label={i18n.t('dialog_cafetoria_id')}
							onChange={evt => {
								this.setState({id: evt.currentTarget.value});
							}}/>
						<TextField
							style={{width: '100%'}}
							required
							invalid={this.state.loginInvalid}
							type='password'
							label={i18n.t('dialog_cafetoria_pin')}
							onChange={evt => {
								this.setState({pin: evt.currentTarget.value});
							}}/>
					</DialogContent>
					<DialogActions>
						<DialogButton action='accept' isDefaultAction>{i18n.t('dialog_cafetoria_submit')}</DialogButton>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}