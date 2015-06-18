exports.home = function(req, res, next){
    res.render('index', { title: 'SmartRooms' });
}

exports.otherpage = function(req, res, next){
    res.render('index', { title: 'SmartRooms' });
}