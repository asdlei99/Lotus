'use strict';

module.exports = function(Dashboard, app, auth, database) {

    // 测试相关
    app.get('/dashboard/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });
    app.get('/dashboard/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });
    app.get('/dashboard/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });
    app.get('/dashboard/example/render', function(req, res, next) {
        Dashboard.render('index', {
            package: 'dashboard'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    // TODO: 怎么拆封路由
    // 组织相关
    var organization = require('../controllers/organization.js');
    app.get('/api/organization/create', auth.requiresLogin, organization.create);
    app.get('/api/organizations/', auth.requiresLogin, organization.findByOwner);

    // 项目相关
    var project = require('../controllers/project.js');
    app.get('/project/create', auth.requiresLogin, project.create);

};
