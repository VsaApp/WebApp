import React, {Component} from 'react';
import TabControls from '../components/TabControls';
import {ClubsAPI} from '../api/Clubs';
import ClubRow from '../components/ClubRow';

export default class Clubs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clubs: [],
			weekday: 0
		};
	}

	componentDidMount() {
		let day = new Date().getDay();
		if (day === 0 || day === 6) {
			day = 1;
		}
		day--;
		this.setState({weekday: day});
		ClubsAPI.get().then(clubs => {
			this.setState({
				clubs: this.overwriteClubs(clubs)
			});
		});
	}

	overwriteClubs(clubs) {
		clubs = clubs.map(clubs => {
			clubs.ags = clubs.ags.map(club => {
				club.name = club.name.replace(/epochal:/i, '').replace(/\(ssd\)/i, '').trim();
				club.time = club.time.toLowerCase().replace('uhr', '').trim().replace('–', '-').replace(/\./g, ':').split('-').map(a => {
					a = a.trim();
					if (!a.includes(':')) {
						a += ':00';
					}
					return a;
				}).join(' - ');
				return club;
			}).sort((a, b) => {
				let aTime = a.time.split(' - ')[0].split(':').map((text, i) => parseInt(text) * (i === 0 ? 60 : 1)).reduce((a, b) => a + b, 0);
				let bTime = b.time.split(' - ')[0].split(':').map((text, i) => parseInt(text) * (i === 0 ? 60 : 1)).reduce((a, b) => a + b, 0);
				return aTime - bTime;
			});
			return clubs;
		});
		return clubs;
	}

	render() {
		return (
			<div>
				{this.state.clubs.map((day, i) => {
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
							{day.ags.map((club, j) => {
								return (<ClubRow key={j} j={j} club={club} clubsCount={day.ags.length}/>);
							})}
						</div>
					);
				})}
			</div>
		);
	}
}
