describe('VAST Linear Creative', function() {

    var VastLinearCreative,
        mockVastResponse,
        helpers;

    function getVastResponse() {
        return {
            wrappers: [
                {
                    "VAST": {
                        "Ad": {
                            "Wrapper": {
                                "AdSystem": {
                                    "nodeValue": "Test Ad Server",
                                    "@version": 1
                                },
                                "VASTAdTagURI": {
                                    "nodeValue": "http://test.video.unrulymedia.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
                                },
                                "Error": {
                                    "nodeValue": "http://example.com/error/ERRORCODE"
                                },
                                "Impression": [
                                    {
                                        "nodeValue": "http://example.com/imp?d=[CACHEBUSTER]"
                                    },
                                    {
                                        "nodeValue": "http://example.com/another-imp?d=[CACHEBUSTER]"
                                    }
                                ],
                                "Creatives": {
                                    "Creative": [{
                                        "Linear": {
                                            "VideoClicks": {
                                                "ClickTracking": [
                                                    {
                                                        "nodeValue":  "http://example.com/video-click1?d=[CACHEBUSTER]"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/video-click2?d=[CACHEBUSTER]"
                                                    }
                                                ]
                                            }
                                        }
                                    }]
                                }
                            },
                            "@id": 1,
                            "@sequence": 1
                        },
                        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "@version": 3,
                        "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                    }
                },
                {
                    "VAST": {
                        "Ad": {
                            "Wrapper": {
                                "AdSystem": {
                                    "nodeValue": "Test Ad Server",
                                    "@version": 1
                                },
                                "VASTAdTagURI": {
                                    "nodeValue": "http://test.video.unrulymedia.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
                                },
                                "Error": {
                                    "nodeValue": "http://example.com/error/ERRORCODE"
                                },
                                "Impression": [
                                    {
                                        "nodeValue": "http://example.com/impression_two_one"
                                    },
                                    {
                                        "nodeValue": "http://example.com/impression_two_two"
                                    }
                                ],
                                "Creatives": {
                                    "Creative": [{
                                        "Linear": {
                                            "VideoClicks": {
                                                "ClickTracking": [
                                                    {
                                                        "nodeValue":  "http://example.com/video-click3?d=[CACHEBUSTER]"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/video-click4?d=[CACHEBUSTER]"
                                                    }
                                                ]
                                            }
                                        }
                                    }]
                                }
                            },
                            "@id": 1,
                            "@sequence": 1
                        },
                        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "@version": 3,
                        "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                    }
                }
            ],
            inline: {
                "VAST": {
                    "Ad": {
                        "InLine": {
                            "AdSystem": {
                                "nodeValue": "Test Ad Server",
                                "@version": 1
                            },
                            "AdTitle": {
                                "nodeValue": "Example Title"
                            },
                            "Description": {
                                "nodeValue": "Example Description"
                            },
                            "Impression":
                                [{
                                    "nodeValue": "http://example.com/impression_two_one"
                                }],
                            "Creatives": {
                                "Creative": [{
                                    "NonLinearAds": {
                                        "NonLinear": {
                                            "StaticResource": {
                                                "nodeValue": "http://example.com/thumb.jpg",
                                                "@creativeType": "image/jpeg"
                                            },
                                            "NonLinearClickThrough": [{
                                                "nodeValue": "http://example.com/clickthrough.html"
                                            }],
                                            "@width": 100,
                                            "@height": 100
                                        }
                                    }
                                }, {
                                    "Linear": {
                                        "Duration": {
                                            nodeValue: '00:00:40'
                                        },
                                        "MediaFiles": {
                                            "MediaFile":[{
                                                'nodeValue': 'videoUrl'
                                            }]
                                        },
                                        "VideoClicks": {
                                            "ClickThrough": {
                                                "nodeValue": "http://example.com/clickthrough"
                                            },
                                            "ClickTracking": [
                                                {
                                                    "nodeValue":  "http://example.com/video-click5?d=[CACHEBUSTER]"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/video-click6?d=[CACHEBUSTER]"
                                                }
                                            ]
                                        }
                                    }
                                }
                                ]
                            }
                        },
                        "@id": 1,
                        "@sequence": 1
                    },
                    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "@version": 3,
                    "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                }
            }
        };
    }

    beforeEach(function(done) {
        mockVastResponse = getVastResponse();

        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            injector
                .store(['util/helpers'])
                .require(['model/vastLinearCreative', 'mocks'], function(module, mocks) {
                    VastLinearCreative = module.VastLinearCreative;
                    helpers = mocks.store['util/helpers'];
                    sinon.stub(helpers, 'getSecondsFromTimeString');

                    done();
                });
        });
    });

    describe('getDuration', function() {
        it('should return number in seconds', function() {
            var result,
                expectedResult = 40,
                linearCreative = new VastLinearCreative(mockVastResponse);

            helpers.getSecondsFromTimeString.withArgs(mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Duration.nodeValue)
                                            .returns(expectedResult);

            result = linearCreative.getDuration();

            expect(result).to.equal(expectedResult);
        });
    });

    describe('getVideoClickTracking', function() {
        beforeEach(function(){

        });

        it('should return an array of click trackers', function() {
            var result,
                linearCreative = new VastLinearCreative(mockVastResponse);

            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(6);
            expect(result).to.contain("http://example.com/video-click1?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click2?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click3?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click4?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click5?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click6?d=[CACHEBUSTER]");
        });
    });
});