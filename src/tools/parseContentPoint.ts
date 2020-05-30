export function parseContentPoint(text:string) {
	let content:string, point:number;
	content = text.trim();
	let pArr = [];
	let len = content.length;
	for (let i=0; i<len; i++) {
		if (isSepChar(content, i) === true) {
			pArr.push(i);
		}
	}
	let plen = pArr.length;
	if (plen === 0) return {content, point};
	let pSep = pArr[0];
	point = parseHour(content.substring(0, pSep));
	if (point !== undefined) return {content:content.substr(pSep).trim(), point};
	pSep = pArr[plen-1];
	point = parseHour(content.substring(pSep+1, len));
	if (point === undefined) return {content, point};
	return {content:content.substring(0, pSep).trim(), point};
}

const seps = [0x20, 9, 10, 13, 0x3000, 0xa0];
function isSepChar(text:string, p:number):boolean {
	let ch = text.charCodeAt(p);
	return seps.indexOf(ch) >= 0;
}

function parseHour(text:string) {
	let p = 0;
	let len = text.length;
	let h = parseNum();
	if (h === undefined) return;
	if (p >= len) return h*60;

	let isDot = false, isColon = false;
	let sep = text.charCodeAt(p);

	// .。．
	if (sep === 46 || sep === 12290 || sep === 65294) {
		isDot = true;
	}
	//:：
	else if (sep === 58 || sep === 65306) {
		isColon = true;
	}
	else {
		// 不是点，也不是colon，肯定错误
		return;
	}
	++p;
	let m = parseNum();
	if (m === undefined) return;
	if (p<len) return;

	if (isDot === true) return Math.floor(Number(h + '.' + m) *60);
	if (isColon === true) return h*60 + m;
	return;

	function parseNum() {
		let num = 0;
		let hasNum = false;
		for (; p<len; p++) {
			let ch = text.charCodeAt(p);
			if (ch>=48 && ch<=57) {
				num = num*10 + ch - 48;
				hasNum = true;
			}
			else {
				break;
			}
		}
		if (hasNum === true) return num;
	}
}

