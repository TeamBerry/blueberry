export interface YoutubeSearchResult {
    kind: string
    etag: string
    nextPageToken: string
    regionCode: string
    pageInfo: {
        totalResults: number
        resultsPerPage: number
    }
    items: Array<YoutubeSearchVideos>
}

export interface YoutubeSearchVideos {
    kind: 'youtube#searchResult'
    etag: string
    id: {
        kind: 'youtube#video'
        videoId: string
    }
    snippet: {
        publishedAt: Date
        channelId: string
        title: string
        description: string
        thumbnails: {
            default: {
                url: string,
                width: number,
                height: number
            },
            medium: {
                url: string,
                width: number,
                height: number
            },
            high: {
                url: string,
                width: number,
                height: number
            }
        }
        channelTitle: string
        liveBroadcastContent: string
    }
}
