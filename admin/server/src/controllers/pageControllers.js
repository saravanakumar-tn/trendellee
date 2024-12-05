import Page from "../models/Page.js";
import Trend from "../models/Trend.js";

const pageControllers = {
  create: async (request, reply) => {
    try {
      const page = request.body;
      const newPage = await Page.create(page);
      const trendUpdate = await Trend.findByIdAndUpdate(page.trend, {
        page: newPage._id,
      });

      reply.code(201).send(newPage);
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
      let pages = [];
      if (filter && filter.id) {
        pages = await Page.find({ _id: { $in: filter.id } });
      } else {
        pages = await Page.find({});
      }
      const length = pages.length;
      pages = pages.slice(range[0], range[1] + 1);
      reply.header("Content-Range", `pages ${range[0]}-${range[1]}/${length}`);
      reply.code(200).send(pages);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  get: async (request, reply) => {
    try {
      const pageId = request.params.id;
      const page = await Page.findById(pageId);
      reply.code(200).send(page);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  update: async (request, reply) => {
    try {
      const pageId = request.params.id;
      const updates = request.body;
      await Page.findByIdAndUpdate(pageId, updates);
      const updated = await Page.findById(pageId);
      reply.code(200).send({ data: updated });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  delete: async (request, reply) => {
    try {
      const pageId = request.params.id;
      const pageToDelete = await Page.findById(pageId);
      await Page.findByIdAndDelete(pageId);
      reply.code(200).send({ data: pageToDelete });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

export default pageControllers;
