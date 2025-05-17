import { settings } from './setings.js';
const elMessage = document.getElementById('message');
const elFormAuth = document.getElementById('formauth');
const elSearchInput = document.getElementById('searchInput');
let timerId = null;

document.addEventListener('DOMContentLoaded', function () {
	const url = new URL(window.location.href);
	const filter = url.searchParams.get('filter');
	url.searchParams.delete('nocache');
	window.history.replaceState({}, document.title, url.toString());	
	if (filter) {
		elSearchInput.value = decodeURIComponent(filter);
		searchFunction();
	};
	setInterval(checkId, 8000)
})

async function checkId() {
	const urlId = document.URL.replace('html', 'json');
	const rep1c_id = document.querySelector('meta[name="rep1c-id"]').getAttribute('content');
	try {
		const response = await fetch(urlId, { cache: 'no-cache' });
		if (!response.ok) throw new Error('Failed to fetch urlId');
		const data = await response.json();
		const server_rep1c_id = data.rep1c_id;
		if (rep1c_id !== server_rep1c_id) {
			console.log('local-id:' + rep1c_id);
			console.log('server-id:' + server_rep1c_id);

			const url = new URL(window.location.href);
			if (elSearchInput.value !== '') {
				const encodedValue = encodeURIComponent(elSearchInput.value);
				url.searchParams.set('filter', encodedValue);
			} else {
				url.searchParams.delete('filter');
				//location.reload();
			};
			url.searchParams.set('nocache', Date.now());
			window.location.href = url;
		}
	} catch (error) {
		console.error('Error checkId:', error);
	}
}

elFormAuth.addEventListener('input', () => {
	clearTimeout(timerId);
	timerId = setTimeout(clearMessage, 1000);
});

elFormAuth.addEventListener('submit', (event) => {
	event.preventDefault();
	clearTimeout(timerId);
	clearMessage();
	const token = document.getElementById('password').value;
	//console.log('submit: ' + token);
	if (token) checkLink(token);
});

function clearMessage() {
	elMessage.textContent = '';
};

async function checkLink(token) {
	try {
		const url1c = `${location.protocol}//${location.hostname}${settings.base1c}`;
		//uricode = encodeURIComponent(token);
		const url1cHS = `${url1c}/hs/api/check/${token}`;

		const response = await fetch(url1cHS);
		if (!response.ok) throw new Error('Нет связи с сервером');
		const data = await response.json();
		if (data.alive) {
			elMessage.textContent = '';
			const utl1cWC = `${url1c}/?C=${token}`;
			console.log('redirect to: ' + utl1cWC);
			window.location.href = utl1cWC;
		} else {
			if (response.ok) {
				throw new Error('Токен не действителен, обратитесь к администратору');
			} else {
				throw new Error(`Ошибка: ${response.status} ${response.body}`);
			};
		};
	} catch (error) {
		elMessage.textContent = `${error.message}`;
	};
	console.log('end checking: ' + elMessage.textContent);
};

elSearchInput.addEventListener('input', () => {
	searchFunction();
});

function searchFunction() {
	const trs = document.querySelectorAll('#standings tbody tr')
	const filter = document.querySelector('#searchInput').value
	const regex = new RegExp(filter, 'i')
	const isFoundInTds = td => regex.test(td.innerHTML)
	const isFound = childrenArr => childrenArr.some(isFoundInTds)
	var j;
	for (j = 0; j < trs.length; j++) {
		if (isFound([...trs[j].children])) {
			trs[j].style.display = "";
		} else
			trs[j].style.display = "none";
	}
};

