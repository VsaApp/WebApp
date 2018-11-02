import React from 'react';
import Main from './pages/Main';
import './pages/Theme.css';
import i18n from './i18n';
import Logo3927 from './resources/images/logo3927.png';
import Logo2048 from './resources/images/logo2048.png';
import Logo1024 from './resources/images/logo1024.png';
import Logo512 from './resources/images/logo512.png';
import Logo256 from './resources/images/logo256.png';
import Logo128 from './resources/images/logo128.png';
import Logo64 from './resources/images/logo64.png';
import Logo32 from './resources/images/logo32.png';
import Logo16 from './resources/images/logo16.png';

export default class Routes {

	apply(router) {
		router.setPwaSchema({
			name: i18n.t('app_name'),
			short_name: i18n.t('app_short_name'),
			gcm_sender_id: '103953800507',
			dir: 'ltr',
			lang: 'de-DE',
			display: 'standalone',
			orientation: 'any',
			theme_color: '#5bc638',
			start_url: '/',
			icons: [
				{
					'src': Logo3927,
					'sizes': '3927x3927'
				},
				{
					'src': Logo2048,
					'sizes': '2048x2048'
				},
				{
					'src': Logo1024,
					'sizes': '1024x1024'
				},
				{
					'src': Logo512,
					'sizes': '512x512'
				},
				{
					'src': Logo256,
					'sizes': '256x256'
				}, {
					'src': Logo128,
					'sizes': '128x128'
				}, {
					'src': Logo64,
					'sizes': '64x64'
				}, {
					'src': Logo32,
					'sizes': '32x32'
				}, {
					'src': Logo16,
					'sizes': '16x16'
				}
			]
		});

		const routes = [
			{
				path: '/',
				exact: false,
				component: () => <Main/>
			}
		];

		router
			.hooks
			.initRoutes
			.tapPromise('AppRoutes', async () => {
				router.addRoutes(routes);
				router.getDefaultSeoSchema = () => ({
					title: i18n.t('app_name'),
					name: i18n.t('app_name'),
					description: '',
					type: 'app',
					url: 'https://pwa.vsa.lohl1kohl.de',
					site_name: i18n.t('app_name'),
					image: '',
					meta: [
						{
							name: 'author',
							content: 'Jan-Luca D.'
						}, {
							name: 'description',
							content: i18n.t('app_name') + ' - Eine Progressive Web App für die Viktoriaschule Aachen'
						}, {
							name: 'theme-color',
							content: '#5bc638'
						}, {
							name: 'apple-mobile-web-app-status-bar-style',
							content: '#5bc638'
						}, {
							name: 'msapplication-TileColor',
							content: '#5bc638'
						}, {
							name: 'application-name',
							content: i18n.t('app_name')
						}, {
							name: 'generator',
							content: i18n.t('app_name')
						}, {
							name: 'apple-mobile-web-app-title',
							content: i18n.t('app_name')
						}, {
							name: 'viewport',
							content: 'width=device-width, initial-scale=1, maximum-scale=5.0'
						}
					]
				});
			});
	}
}
