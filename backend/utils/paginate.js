export const paginate = async (model, req, res) => {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 3);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {}
    const filters = req.body.filters;
    const sort = req.body.sort;

    if (endIndex < await model.find(filters).countDocuments()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.results = await model.find(filters).sort(sort).limit(limit).skip(startIndex);
    res.results = results;
}