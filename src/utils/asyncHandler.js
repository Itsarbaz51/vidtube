const asyncHandler = (requestHandler)=> {
    (req,res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((Error) => next(Error))
    }
}

export {
    asyncHandler
}