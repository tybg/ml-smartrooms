/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

import express = require('express');
import controller = require('../controllers/index');

var router = express.Router();

var indexRoutes = () => {
    router.get('/', (req, res) => {
        controller.home(req, res);
    });

    return router;
};

export = indexRoutes;