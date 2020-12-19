const mongoose = require('mongoose');
const schema = mongoose.Schema;

const playlistSchema = new schema({

    noOfVideos: {
        type: String,
    },
    playlistDescription: {
        type: String,
    },
    playlistThumbnail: {
        type: String,
    },
    videoData: [{
        videoTitle:{
            type: String,
        },
        videoURL: {
            type: String,
        },
        videoID: {
            type: String,
        },
        videoLength: {
            type: String
        },
        videoDescription: {
            type: String
        },
        videoThumbnail: {
            type: String
        }
    }]
});

const playlistModel = mongoose.model("playlist", playlistSchema);

module.exports = playlistModel;