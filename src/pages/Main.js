import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Icon from '@mdi/react';
import {mdiMenu} from '@mdi/js';
import {Snackbar} from '@rmwc/snackbar';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle} from '@rmwc/toolbar';
import '@material/snackbar/dist/mdc.snackbar.css';
import '@material/toolbar/dist/mdc.toolbar.css';
import cookie from 'react-cookies';
import i18n from '../i18n';
import {LoginAPI} from '../api/Login';
import UnitPlan from './UnitPlan';
import ReplacementPlan from './ReplacementPlan';
import LoginDialog from '../components/LoginDialog';
import AppDrawer from '../components/AppDrawer';
import './Theme.css';

export default class Main extends Component {

	constructor(props) {
		console.log(process.env);
		super(props);
		this.state = {
			showLogin: false,
			username: '',
			password: '',
			drawerOpen: false,
			page: <UnitPlan processNotification={data => this.processNotification(data)}/>,
			title: i18n.t('drawer_unitplan'),
			grade: '',
			toolbarHeight: 0,
			snackbarOpen: false,
			snackbarText: '',
			snackbarData: {}
		};
	}

	componentWillMount() {
		this.setState({
			grade: cookie.load('grade'),
			username: cookie.load('username'),
			password: cookie.load('password'),
			showLogin: cookie.load('username') === undefined || cookie.load('password') === undefined || cookie.load('username') === '' || cookie.load('password') === ''
		});
	}

	processNotification(data) {
		console.log(data);
		this.refs.drawer.setState({tab: data.tab});
		const oldPage = this.state.page;
		if (data.tab === 1) {
			this.setState({
				page: <ReplacementPlan ref={c => this.page = c} processNotification={data => this.processNotification(data)}/>,
				title: i18n.t('drawer_replacementplan')
			});
		} else if (data.tab === 2) {
			return;
			/*
			Uncomment if DSGVO doesn't suck anymore
			this.setState({page: <Teachers ref={c => this.page = c}/>, title: i18n.t('drawer_teachers')});
			*/
		}
		const interval = setInterval(() => {
			if (this.state.page !== oldPage) {
				clearInterval(interval);
				this.page.setState({data: data});
			}
		}, 10);
	}

	componentDidMount() {
		let hash = decodeURIComponent(location.href.split('#/')[1]);
		try {
			this.processNotification(JSON.parse(hash));
		} catch (e) {
		}
		location.hash = '#/';
		navigator.serviceWorker.addEventListener('message', event => {
			if ('firebase-messaging-msg-data' in event.data) {
				let data = JSON.parse(event.data['firebase-messaging-msg-data'].data.data);
				let title = data.weekday;
				let body = '';
				if (data.changes.length > 0) {
					body = data.changes.map(change => {
						return change.unit + '. ' + change.changed.info + ' ' + change.changed.teacher + ' ' + change.changed.room
					}).join(<br/>);
				} else {
					body = 'Keine Änderungen';
				}
				const interval = setInterval(() => {
					if (!this.state.snackbarOpen) {
						this.setState({
							snackbarOpen: true, snackbarText: <div>{title + ':'}<br/>{body}</div>,
							snackbarData: {tab: 1, day: data.weekday}
						});
						clearInterval(interval);
					}
				}, 100);
			} else {
				this.processNotification(event.data);
			}
		});
		this.setState({toolbarHeight: ReactDOM.findDOMNode(this.refs.toolbar).clientHeight});
		if (!this.state.showLogin) {
			LoginAPI.login(this.state.username, this.state.password).then(correct => {
				console.log(correct);
				if (!correct) {
					this.setState({showLogin: true});
				}
			}).catch(() => {
			});
		}
		this.setState({loginInvalid: false});
	}

	render() {
		return (
			<div id='wrapper'>
				<Snackbar
					style={{display: (this.state.snackbarOpen ? 'block' : 'none')}}
					show={this.state.snackbarOpen}
					onHide={() => this.setState({snackbarOpen: false})}
					message={this.state.snackbarText}
					actionText={i18n.t('snackbar_new_replacementplan_open')}
					multiline={true}
					actionHandler={() => {
						this.setState({snackbarOpen: false});
						this.processNotification(this.state.snackbarData);
					}}
					timeout={2000}
					dismissesOnAction={false}/>
				<LoginDialog
					show={this.state.showLogin}
					onClose={() => this.setState({showLogin: false})}/>
				<AppDrawer
					ref='drawer'
					show={this.state.drawerOpen}
					processNotification={data => this.processNotification(data)}
					onClose={() => this.setState({drawerOpen: false})}
					updateState={state => this.setState(state)}/>
				<Toolbar fixed ref='toolbar'>
					<ToolbarRow>
						<ToolbarSection alignStart>
							<Icon
								path={mdiMenu}
								size={2}
								color='white'
								onClick={() => {
									this.setState({drawerOpen: true});
									setTimeout(() => this.refs.drawer.selectTab(), 100);
								}}/>
							<ToolbarTitle>{this.state.title}</ToolbarTitle>
						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>
				<div
					style={{
						height: '100%',
						marginTop: this.state.toolbarHeight - 5,
						padding: 10,
						paddingBottom: 0,
						overflowY: 'hidden'
					}}>
					{this.state.page}
				</div>
			</div>
		);
	}
}