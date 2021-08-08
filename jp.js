function getJpDay() {
	var jp;
	switch (moment().days()) {
		case 0:
		jp = "日";
		break;
		case 1:
		jp = "月";
		break;
		case 2:
		jp = "火";
		break;
		case 3:
		jp = "水";
		break;
		case 4:
		jp = "木";
		break;
		case 5:
		jp = "金";
		break;
		case 6:
		jp = "土";
		break;
	}
	return "(" + jp + ")";
}

function getJpNum(i) {
	var jp;
	switch (i) {
		case 1:
		jp = "１";
		break;
		case 2:
		jp = "２";
		break;
		case 3:
		jp = "３";
		break;
		case 4:
		jp = "４";
		break;
		case 5:
		jp = "５";
		break;
		case 6:
		jp = "６";
		break;
		case 7:
		jp = "７";
		break;
		case 8:
		jp = "８";
		break;
		case 9:
		jp = "９";
		break;
	}
	return jp;
}