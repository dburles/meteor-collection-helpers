# run tests with
# cd packages/meteor-collection-helpers && meteor test-packages ./

if Meteor.isServer

	# TODO! add some tests!
	# this just gets the framework in place but doesn't test anything

	Tinytest.add "setup", (test) ->
		test.equal 1, 1, "tiny test is running"
		console.log("TODO: tests")

		### TODO
		create a collection
		add helpers
		check they work!
		###
		