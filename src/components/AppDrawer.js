import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Drawer, DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle} from '@rmwc/drawer';
import {List, ListItem} from '@rmwc/list';
import '@material/drawer/dist/mdc.drawer.css';
import i18n from '../i18n';
import {StorageAPI} from '../api/Storage';
import UnitPlan from '../pages/UnitPlan';
import ReplacementPlan from '../pages/ReplacementPlan';
import Settings from '../pages/Settings';
import Clubs from '../pages/Clubs';

export default class AppDrawer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			grade: StorageAPI.get('grade'),
			tab: 0
		};
		this.selectTab = this.selectTab.bind(this);
	}

	selectTab() {
		ReactDOM.findDOMNode(this.refs[parseInt(this.state.tab)]).focus();
	}

	render() {
		return (
			<Drawer
				modal
				style={{top: 0}}
				open={this.props.show}
				onClose={() => this.props.onClose()}>
				<DrawerHeader>
					<DrawerTitle>{i18n.t('app_name')}</DrawerTitle>
					<DrawerSubtitle>{this.state.grade}</DrawerSubtitle>
				</DrawerHeader>
				<DrawerContent>
					<List>
						<ListItem
							ref='0'
							onClick={() => {
								this.setState({tab: 0});
								this.selectTab();
								setTimeout(() => {
									this.props.onClick({
										page: <UnitPlan processNotification={data => this.props.processNotification(data)}/>,
										drawerOpen: false,
										title: i18n.t('drawer_unitplan')
									});
								}, 1000);
							}}>
							{i18n.t('drawer_unitplan')}
						</ListItem>
						<ListItem
							ref='1'
							onClick={() => {
								this.setState({tab: 1});
								this.props.onClick({
									page: <ReplacementPlan processNotification={data => this.props.processNotification(data)}/>,
									drawerOpen: false,
									title: i18n.t('drawer_replacementplan')
								});
								this.selectTab();
							}}>
							{i18n.t('drawer_replacementplan')}
						</ListItem>
						{/*
						Uncomment if DSGVO doesn't suck anymore
						<ListItem
							ref='2'
							onClick={() => {
								this.setState({tab: 2});
								this.props.onClick({
									page: <Teachers/>,
									drawerOpen: false,
									title: i18n.t('drawer_teachers')
								});
								this.selectTab();
							}}>
							{i18n.t('drawer_teachers')}
						</ListItem>
						*/}
						<ListItem
							ref='3'
							onClick={() => {
								this.setState({tab: 3});
								this.props.onClick({
									page: <Clubs/>,
									drawerOpen: false,
									title: i18n.t('drawer_clubs')
								});
								this.selectTab();
							}}>
							{i18n.t('drawer_clubs')}
						</ListItem>
						<ListItem
							ref='4'
							onClick={() => {
								this.setState({tab: 4});
								this.props.onClick({
									page: <Settings/>,
									drawerOpen: false,
									title: i18n.t('drawer_settings')
								});
								this.selectTab();
							}}>
							{i18n.t('drawer_settings')}
						</ListItem>
					</List>
				</DrawerContent>
			</Drawer>
		);
	}
}