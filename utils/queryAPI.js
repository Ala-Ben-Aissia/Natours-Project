class QueryAPI {
	constructor(query, reqQuery) {
		this.query = query;
		this.reqQuery = reqQuery;
	}
	fields() {
		const fields = this.reqQuery.fields?.replaceAll(",", " ");
		if (!fields) {
			this.query.select("-__v");
		} else {
			this.query.select(fields);
		}
		return this;
	}
	sort() {
		const sortBy = this.reqQuery.sort
			?.concat(",_id") // consistent sorting
			.replaceAll(",", " ");
		this.query.sort(sortBy);
		return this;
	}
	filter() {
		const reqQuery = { ...this.reqQuery };
		for (const key in reqQuery) {
			if (typeof reqQuery[key] !== "object") {
				delete reqQuery[key];
			}
		}
		const filter = JSON.parse(
			JSON.stringify(reqQuery).replace(
				/\b(gte|gt|lte|lt)\b/g,
				(match) => `$${match}`
			)
		);
		this.query.find(filter);
		return this;
	}
	paginate() {
		const page = Math.abs(+this.reqQuery.page) ?? 1;
		const limit = Math.abs(+this.reqQuery.limit) ?? 5;
		const skip = (page - 1) * limit;
		this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = QueryAPI;
