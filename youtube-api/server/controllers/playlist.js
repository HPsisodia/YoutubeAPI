const playlistModel = require("./../models/playlist");

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");


const axios = require("axios");

exports.playlist = async(req,res) => {

    const playlistId = req.body.PlayListLink
    const id = playlistId.split("=");
    try {
        const playlistData = await axios({
            method: "get",
            url:
                `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${id[1]}&maxResults=50&key=AIzaSyCowv6rSWR73vKv-bX0Q9TqSwFL4tElUJA`
        });

        const playlistItemData = await axios({
            method: "get",
            url:
                `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id[1]}&key=AIzaSyCowv6rSWR73vKv-bX0Q9TqSwFL4tElUJA`
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
                        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videoId}&key=AIzaSyCowv6rSWR73vKv-bX0Q9TqSwFL4tElUJA`
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

        const data2 = await axios({
            method: "get",
            url:
                "https://docs.google.com/spreadsheets/d/1IEX5FSy0gsGEQxbLmdiS4_b6Cbrv8iFz/edit?rtpof=true"
        });
        console.log("in here");
        return res
          .status(statusCode.success)
          .json(
            returnJsonResponse(
              statusCode.success,
              "success",
              "successfully fetched",
              final
            )
          );

        
    } catch (error) {
        
    }
}