/**
 * GET /
 * @param req
 * @param res
 * @returns {}
 */
exports.home = function (req, res) {
    res.render('index', { title: 'SmartRooms' });
};
