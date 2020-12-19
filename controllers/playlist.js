const playlistModel = require("./../models/playlist");

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");


const axios = require("axios");

exports.playlist = async(req,res) => {

    const playlistId = req.body.playlistId
    const id = playlistId.split("=");
    try {
        const apikey = "";
        const playlistData = await axios({
            method: "get",
            url:
                `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${id[1]}&maxResults=50&key=${apikey}`
        });

        const playlistItemData = await axios({
            method: "get",
            url:
                `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id[1]}&key=${apikey}`
        });

        const items = playlistItemData.data.items;
        const genericData = {
            noOfVideos: items.length,
            playlistDescription: playlistData.data.items[0].snippet.description,
            thumbnail: playlistData.data.items[0].snippet.thumbnails.default.url  
        }
        const videoIds = []; 
        await Promise.all(
            items.map(async (items,index) =>{
                const ID = items.snippet.resourceId.videoId;
                videoIds.push(ID);
            })
        );
        let video = [];
        await Promise.all(
            videoIds.map(async (videoId, index) =>{
                const data = await axios({
                    method: "get",
                    url:
                        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videoId}&key=${apikey}`
                });

                const videoDetails = data.data;
                const duration = videoDetails.items[0].contentDetails.duration.split("T");

                const videoData = {
                    videoTitle: videoDetails.items[0].snippet.title,
                    videoURL: `https://www.youtube.com/watch?v=${videoId}`,
                    videoID: videoId,
                    videoLength: duration[1],
                    videoDescription: videoDetails.items[0].snippet.description,
                    videoThumbnail: videoDetails.items[0].snippet.thumbnails.default.url

                }

                video.push(videoData);
            })
        );
        const final = {
            genericData: genericData,
            videoData: video
        }
        const playlistSave = {
            noOfVideos: genericData.noOfVideos,
            playlistDescription: genericData.playlistDescription,
            playlistThumbnail: genericData.thumbnail,
            videoData: video
        }

        const playlistAdd = new playlistModel(playlistSave);
        const playlistResult = await playlistAdd.save();


        return res
          .status(statusCode.success)
          .json(
            returnJsonResponse(
              statusCode.success,
              "success",
              "Video Data fetched succesfully",
              final
            )
          );

        
    } catch (error) {
        
    }
}