srcFiles = [
  "<%= srcDir %>/helper.js",
  "<%= srcDir %>/cookieStorage.js",
  "<%= srcDir %>/localStorage.js",
  "<%= srcDir %>/storage.js",
  "<%= srcDir %>/hashgrid.js"
];

module.exports = {
  options: {
    enclose: {
      "window": "window",
      "document": "document"
    }
  },

  normal: {
    options: {
      mangle: false,
      compress: false,
      beautify: true
    },

    files: {
      "<%= buildDir %>/javascripts/hashgrid.js": srcFiles
    }
  },

  min: {
    options: {
      mangle: true,
      compress: true
    },

    files: {
      "<%= buildDir %>/javascripts/hashgrid.min.js": srcFiles
    }
  }
};
