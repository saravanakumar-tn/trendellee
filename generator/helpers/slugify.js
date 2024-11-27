const slugify = (str) => {
  return str.toLowerCase().split(" ").join("-");
};

export { slugify };
