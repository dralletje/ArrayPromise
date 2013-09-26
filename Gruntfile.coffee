module.exports = (grunt) ->
  console.log '>> Welcome to Michiel Dral\'s Gruntfile!'
  
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-simple-mocha"
  grunt.loadNpmTasks "grunt-contrib-watch"
  
  grunt.initConfig
    coffee:
      dev:
        files:
          "index.js": "index.coffee"

      test:
        files: [
          expand: true
          cwd: "./test"
          src: ["*.coffee"]
          dest: "./test"
          ext: ".js"       
        ]
        
      lib:
        files: [
          expand: true
          cwd: "./lib"
          src: ["*.coffee"]
          dest: "./lib"
          ext: ".js"       
        ]

    simplemocha:
      dev:
        src: "test/test.js"
        options:
          reporter: "spec"
          slow: 200
          timeout: 1000

    watch:
      all:
        files: [ "index.coffee", "test/*.coffee" ]
        tasks: [ "buildDev", "buildTest", "test" ]

  grunt.registerTask "test", "simplemocha:dev"
  grunt.registerTask "buildDev", ["coffee:dev", "coffee:lib"]
  grunt.registerTask "buildTest", "coffee:test"
  grunt.registerTask "watch", ["buildDev", "buildTest", "test", "watch:all"]
  
  grunt.registerTask "default", ["buildDev", "buildTest", "test"]