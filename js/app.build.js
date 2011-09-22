({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../SeatingPlanner-build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    //optimize: "none",

    modules: [

        //Optimize the application files. 
		{
			name: "libs/Backbone.Framework"
		},
		{
			name: "app/AppMain",
			exclude: ["libs/Backbone.Framework"],
		},
        {
            name: "main",
			exclude: ["app/AppMain"],
			override: { optimize: "none" }
        }
    ]
})
