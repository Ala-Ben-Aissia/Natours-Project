exports.durationConverter = (duration) => {
	const weeks = Math.floor(duration / 7);
	const days = duration % 7;
	if (duration % 7 === 0) {
		if (weeks === 1) {
			return `1 week`;
		} else {
			return `${weeks} weeks`;
		}
	}
	if (weeks === 0) {
		if (days === 1) {
			return `${days} day`;
		} else {
			return `${days} days`;
		}
	} else {
		if (weeks === 1) {
			return `1 week${
				days === 1 ? ` and 1 day` : ` and ${days} days`
			}`;
		} else {
			return `${weeks} weeks${
				days === 1 ? ` and 1 day` : ` and ${days} days`
			}`;
		}
	}
};
