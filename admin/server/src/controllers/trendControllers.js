import Trend from "../models/Trend.js";

const trendControllers = {
  create: async (request, reply) => {
    try {
      const trend = request.body;
      const newTrend = await Trend.create(trend);
      reply.code(201).send(newTrend);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  fetch: async (request, reply) => {
    try {
      let range = [];
      if (request.query.range) {
        range = JSON.parse(request.query.range);
      }
      let filter = {};
      if (request.query.filter) {
        filter = JSON.parse(request.query.filter);
      }
      let trends = [];
      trends = await Trend.find({});
      if (filter && filter.id) {
        trends = await Trend.find({ _id: { $in: filter.id } });
      }
      if (filter && filter.page) {
        trends = await Trend.find({ page: { $exists: false } });
      }
      const length = trends.length;
      trends = trends.slice(range[0], range[1] + 1);
      reply.header(
        "Content-Range",
        `categories ${range[0]}-${range[1]}/${length}`
      );
      reply.code(200).send(trends);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  get: async (request, reply) => {
    try {
      const trendId = request.params.id;
      const trend = await Trend.findById(trendId);
      reply.code(200).send(trend);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  update: async (request, reply) => {
    try {
      const trendId = request.params.id;
      const updates = request.body;
      await Trend.findByIdAndUpdate(trendId, updates);
      const updated = await Trend.findById(trendId);
      reply.code(200).send({ data: updated });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  delete: async (request, reply) => {
    try {
      const trendId = request.params.id;
      const trendToDelete = await Trend.findById(trendId);
      await Trend.findByIdAndDelete(trendId);
      reply.code(200).send({ data: trendToDelete });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

export default trendControllers;
