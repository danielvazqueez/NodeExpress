if (process.env.NODE_ENV === 'production') {
	var apikey = process.env.API_KEY
} else {
	const credentials = require('./credentials.js')
	var apikey = credentials.apikey
}

const request = require('request')
console.log(apikey)

const omdbMovie = function(title, callback) {
	const url = 'http://www.omdbapi.com/?apikey=' + apikey + '&t=' + title

	request({url, json : true}, function(error, response) {
		if (error) {
			callback(error, undefined)
		} else {
			const data = response.body
			if (data.Response == 'False') {
				callback(data.Error, undefined)
			} else {
				const info = {
					title: data.Title,
					plot: data.Plot,
					rating: data.imdbRating,
					seasons: data.totalSeasons
				}
				callback(undefined, info)
			}
		}
	})
}

const omdbSeason = (title, season, callback) => {
	const url = 'http://www.omdbapi.com/?apikey=' + apikey +
							'&t=' + title + '&Season=' + season
	request({ url, json: true }, function(error, response) {
		if (error) {
			callback(error, undefined)
		} else {
			const data = response.body

			if (data.Response == 'False') {
				callback(data.Error, undefined)
			} else {
				const info = {
					season : season,
					episodes : []
				}
				for (i in data.Episodes) {
					info.episodes.push( data.Episodes[i].Title)
				}
				callback(undefined, info)
			}
		}
	})
}

module.exports = {
	omdbMovie : omdbMovie,
	omdbSeason : omdbSeason
}