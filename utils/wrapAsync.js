module.exports = (fun) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}