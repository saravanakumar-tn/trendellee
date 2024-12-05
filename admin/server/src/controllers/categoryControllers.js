import Category from "../models/Category.js";

const categoryControllers = {
  create: async (request, reply) => {
    try {
      const category = request.body;
      const newCategory = await Category.create(category);
      reply.code(201).send(newCategory);
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
      let categories = [];
      if (filter && filter.id) {
        categories = await Category.find({ _id: { $in: filter.id } });
      } else {
        categories = await Category.find({});
      }
      const length = categories.length;
      categories = categories.slice(range[0], range[1] + 1);
      reply.header(
        "Content-Range",
        `categories ${range[0]}-${range[1]}/${length}`
      );
      reply.code(200).send(categories);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  get: async (request, reply) => {
    try {
      const categoryId = request.params.id;
      const category = await Category.findById(categoryId);
      reply.code(200).send(category);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  update: async (request, reply) => {
    try {
      const categoryId = request.params.id;
      const updates = request.body;
      await Category.findByIdAndUpdate(categoryId, updates);
      const updated = await Category.findById(categoryId);
      reply.code(200).send({ data: updated });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  delete: async (request, reply) => {
    try {
      const categoryId = request.params.id;
      const categoryToDelete = await Category.findById(categoryId);
      await Category.findByIdAndDelete(categoryId);
      reply.code(200).send({ data: categoryToDelete });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

export default categoryControllers;
