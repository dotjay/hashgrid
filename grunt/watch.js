module.exports = {
  javascripts: {
    files: ["<%= srcDir %>/**/*.js"],
    tasks: ["build"]
  },
  demo: {
    files: ["src/index.jade"],
    tasks: ["build"]
  }
};
