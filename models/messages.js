import auth from '../lib/auth/auth.service';

module.exports = {
  name: 'message',
  schema: {
    name: {
      type: String,
      required: true
    },
    description: String,
    isDeleted: Boolean
  },
  routesMiddleware: {
    index: auth.isAuthenticated(),
    show: auth.isAuthenticated(),
    create: auth.isAuthenticated(),
    update: auth.isAuthenticated(),
    destroy: auth.hasRole('admin')
  },
  extendsRoutes: [
    {
      method: 'get',
      path: '/extends',
      // middleware: auth.isAuthenticated(),
      controller: function (req, res) {
        const Model = req.Model;
        Model.find().then(function (e) {
          res.send(e)
        });
      }
    }
  ]
};
