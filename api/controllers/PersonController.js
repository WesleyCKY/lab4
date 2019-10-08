/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            // render this page
            return res.view('person/create');
        // if the request is not ok
        if (!req.body.Person)
            return res.badRequest("Form-data not received.");
        // the Database object (database function)
        await Person.create(req.body.Person);
        // return ok message as response
        return res.ok("Successfully created!");
    },

    // json function
    json: async function (req, res) {
        // rechieve every thing 
        var persons = await Person.find();
        // use jason format to achieve
        return res.json(persons);
    },

    // action - index
    index: async function (req, res) {

        var models = await Person.find();
        return res.view('person/index', { persons: models });

    },

    // action - view
    view: async function (req, res) {
        // find one by id 
        var model = await Person.findOne(req.params.id);
        //  if this is null or not be found , return not found 
        if (!model) return res.notFound();
        // display name and age
        // model variale is parsed to person in "person/view"
        return res.view('person/view', { person: model });

    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var models = await Person.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.ok("Person Deleted.");

    },

    // action - update
    update: async function (req, res) {

        if (req.method == "GET") {

            var model = await Person.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('person/update', { person: model });

        } else {

            if (!req.body.Person)
                return res.badRequest("Form-data not received.");

            var models = await Person.update(req.params.id).set({
                name: req.body.Person.name,
                age: req.body.Person.age
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");

        }
    },
    search: async function (req, res) {

        const qName = req.query.name || "";
        const qAge = parseInt(req.query.age);

        if (isNaN(qAge)) {

            var models = await Person.find({
                where: { name: { contains: qName } },
                sort: 'name'
            });

        } else {

            var models = await Person.find({
                where: { name: { contains: qName }, age: qAge },
                sort: 'name'
            });

        }

        return res.view('person/index', { persons: models });
    },

    // action - paginate
paginate: async function (req, res) {

    const qPage = Math.max(req.query.page - 1, 0) || 0;

    const numOfItemsPerPage = 3;

    var models = await Person.find({
        limit: numOfItemsPerPage, 
        skip: numOfItemsPerPage * qPage
    });

    var numOfPage = Math.ceil(await Person.count() / numOfItemsPerPage);

    return res.view('person/paginate', { persons: models, count: numOfPage });
},

};

