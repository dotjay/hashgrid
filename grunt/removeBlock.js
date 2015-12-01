module.exports = {
  production: {
    options: [
      "REMOVE START",
      "REMOVE END"
    ],
    files: [
      {src: "<%= srcDir %>/helper.js", dest: "<%= tempDir %>/helper.js"},
      {src: "<%= srcDir %>/cookieStorage.js", dest: "<%= tempDir %>/cookieStorage.js"},
      {src: "<%= srcDir %>/sessionStorage.js", dest: "<%= tempDir %>/sessionStorage.js"},
      {src: "<%= srcDir %>/storage.js", dest: "<%= tempDir %>/storage.js"},
      {src: "<%= srcDir %>/hashgrid.js", dest: "<%= tempDir %>/hashgrid.js"}
    ]
  }
};
