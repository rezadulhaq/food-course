const getUserId = function(data){
    let temp = data.UsersCourses.map(function(el){
        return el.UserId
    })
    return temp
}
module.exports =  getUserId