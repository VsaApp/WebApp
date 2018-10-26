import React, {Component} from 'react';

export default class ClubRow extends Component {
	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateRows: '50% 50%',
					gridGap: 2.5,
					paddingBottom: 5,
					paddingTop: 5,
					borderBottom: (this.props.j !== this.props.clubsCount - 1 ? '1px solid gray' : 'none')
				}}>
				{[
					[this.props.club.name, this.props.club.room],
					[this.props.club.time, this.props.club.grades]
				].map((row, i) => {
					return (
						<div
							key={i}
							style={{
								display: 'grid',
								gridTemplateColumns: '50% 50%'
							}}>{row.map((text, j) => {
							const textAlign = j === 0 ? 'left' : 'right';
							return (
								<p
									key={j}
									style={{
										margin: 0,
										textAlign,
										fontWeight: (i === 0 && j === 0 ? 'bold' : 'none')
									}}>{text}</p>
							);
						})}</div>
					);
				})}
			</div>
		);
	}
}