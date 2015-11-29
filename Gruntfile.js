module.exports = function(grunt) {

  require("load-grunt-config")(grunt, {
    data: {
      srcDir: "src",
      buildDir: "dist",
      tempDir: "temp"
    }
  });

  grunt.registerTask("build", ["clean:dist", "uglify"]);
  grunt.registerTask("dev", ["build", "watch"]);
  grunt.registerTask("default", "build");
};
