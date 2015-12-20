module.exports = function(grunt) {

  require("load-grunt-config")(grunt, {
    data: {
      srcDir: "src/javascripts",
      buildDir: "dist/javascripts",
      tempDir: "temp"
    }
  });

  grunt.registerMultiTask("removeBlock", function() {
    var removalRegEx = new RegExp("(\/\/ " + this.options()[0] + " \/\/)(?:[^])*?(\/\/ " + this.options()[1] +  " \/\/)", "g");

    this.data.files.forEach(function(fileObj){
      var
        sourceFile = grunt.file.read( fileObj.src ),
        removedFile = sourceFile.replace( removalRegEx, "" ),
        targetFile = grunt.file.write( fileObj.dest, removedFile );
    });
  });

  grunt.registerTask("build", ["clean:dist", "clean:demo", "removeBlock", "uglify", "jade", "clean:temp"]);
  grunt.registerTask("dev", ["build", "watch"]);
  grunt.registerTask("default", "build");
};
