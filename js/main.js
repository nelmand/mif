import { settings } from './setings.js';

let lastOfUs = null;
let strLog = '';

window.addEventListener('load', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');
	if (token) checkLink(token)
	else searchChart();
});

async function checkLink(token) {
	try {
		strLog = 'nice!';
		const url1c = `${location.protocol}//${location.hostname}${settings.base1c}`;
		const url1cHS = `${url1c}/hs/api/check/${token}`;
		const response = await fetch(url1cHS);
		if (!response.ok) throw new Error('Нет связи с сервером');
		const data = await response.json();
		if (data.alive) {
			const utl1cWC = `${url1c}/?C=${token}`;
			console.log('redirect to: ' + utl1cWC);
			window.location.href = utl1cWC;
		} else if (response.ok) throw new Error('Токен не действителен, обратитесь к администратору')
		else throw new Error(`Ошибка: ${response.status} ${response.body}`);
	} catch (error) {
		strLog = `${error.message}`;
		searchChart();
	};
	console.log('end checking: ' + strLog);
};

async function searchChart() {
	try {
		const response2 = await fetch('charts/lastOfUs.json', {cache: 'no-cache'});
		const data = await response2.json();
		lastOfUs = `charts/${data.lastOfUs}`;
		window.location.href = lastOfUs;
	} catch (error) {
		console.error('Ошибка загрузки скринов:', error);
	};
};
