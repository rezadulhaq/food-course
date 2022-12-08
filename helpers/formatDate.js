const formatDate = function(date){
    return new Date(date).toLocaleDateString('id-ID', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
}

module.exports = formatDate