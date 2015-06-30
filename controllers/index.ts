/// <reference path="../typings/express/express.d.ts"/>
import express = require('express');

/**
 * GET /
 * @param req 
 * @param res 
 * @returns {} 
 */
export var home = (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'SmartRooms' });
};