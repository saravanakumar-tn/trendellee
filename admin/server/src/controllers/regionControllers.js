import Region from "../models/Region.js";

const regionControllers = {
  create: async (request, reply) => {
    try {
      const region = request.body;
      const newRegion = await Region.create(region);
      reply.code(201).send(newRegion);
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
      let regions = [];
      if (filter && filter.id) {
        regions = await Region.find({ _id: { $in: filter.id } });
      } else {
        regions = await Region.find({});
      }
      const length = regions.length;
      regions = regions.slice(range[0], range[1] + 1);
      reply.header(
        "Content-Range",
        `categories ${range[0]}-${range[1]}/${length}`
      );
      reply.code(200).send(regions);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  get: async (request, reply) => {
    try {
      const regionId = request.params.id;
      const region = await Region.findById(regionId);
      reply.code(200).send(region);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  update: async (request, reply) => {
    try {
      const regionId = request.params.id;
      const updates = request.body;
      await Region.findByIdAndUpdate(regionId, updates);
      const updated = await Region.findById(regionId);
      reply.code(200).send({ data: updated });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  delete: async (request, reply) => {
    try {
      const regionId = request.params.id;
      const regionToDelete = await Region.findById(regionId);
      await Region.findByIdAndDelete(regionId);
      reply.code(200).send({ data: regionToDelete });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

export default regionControllers;
