define(['util/objectUtil', 'util/helpers', 'model/vastMediaFile'], function(objectUtil, helpers, VastMediaFile) {
    function VastLinearCreative(vastResponse) {
        this.vastResponse = vastResponse;
        this.linearInline =  objectUtil.getFromObjectPath(this.vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.Linear');
        this.linearWrappers =  objectUtil.getArrayFromObjectPath(this.vastResponse, 'wrappers.VAST.Ad.Wrapper.Creatives.Creative.Linear');
    }

    VastLinearCreative.prototype.getDuration = function getDuration() {
        var stringTime = objectUtil.getFromObjectPath(this.linearInline, 'Duration.nodeValue');
        return helpers.getSecondsFromTimeString(stringTime);
    };

    VastLinearCreative.prototype.getClickTrackers = function getClickTrackers() {
        var wrapperClickTracking = objectUtil.getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking.nodeValue'),
            inlineClickTracking = objectUtil.getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking.nodeValue');

        return inlineClickTracking.concat(wrapperClickTracking);
    };

    VastLinearCreative.prototype.getMediaFiles = function getMediaFiles(filter) {
        var mediaFiles =  objectUtil.getArrayFromObjectPath(this.linearInline, 'MediaFiles.MediaFile');

        filter = filter || {};

        mediaFiles = mediaFiles.map(function (vastMediaFileXml) {
            return new VastMediaFile(vastMediaFileXml);
        });

        mediaFiles = mediaFiles.filter(function(vastMediaFileXml) {
            var property,
                matchesFilter = true;

            for (property in filter) {
                if (filter.hasOwnProperty(property)) {
                    matchesFilter = matchesFilter && vastMediaFileXml[property] === filter[property];
                }
            }

            return matchesFilter;
        });

        return mediaFiles;
    };

    VastLinearCreative.prototype.hasFlashVPAID = function hasFlashVPAID() {
        return this.getMediaFiles({
            apiFramework: 'VPAID',
            type: 'application/x-shockwave-flash'
        }).length > 0;
    };

    VastLinearCreative.prototype.hasJavascriptVPAID = function hasJavascriptVPAID() {
        return this.getMediaFiles({
                apiFramework: 'VPAID',
                type: 'application/javascript'
            }).length > 0;
    };

    VastLinearCreative.prototype.hasMp4 = function hasMp4() {
        return this.getMediaFiles({
                type: 'video/mp4'
            }).length > 0;
    };

    return {
        VastLinearCreative: VastLinearCreative
    };
});
