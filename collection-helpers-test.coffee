# run tests with
# cd packages/meteor-collection-helpers && meteor test-packages

if Meteor.isServer

	Tinytest.add "setup", (test) ->
		test.equal 1, 1, "tiny test is running"
		console.log("todo")