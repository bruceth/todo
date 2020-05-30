export function hourText(hour: number):string {
	if (!hour) return;
	let h = Math.floor(hour / 60);
	let m = Math.floor(hour % 60);
	let ret:string; // h + ':' + String(m).substr(1);
	if (h > 0) {
		ret = h + '时';
		if (m > 0) {
			ret += m + '分';
		}
	}
	else {
		ret = m + '分钟';
	}
	return ret;
}
