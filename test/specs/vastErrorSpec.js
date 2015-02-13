describe('VAST Error', function() {
    var Q,
        VastError;

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            injector.require(['q', 'vastError'], function(q, vastErrorClass) {
                Q = q;
                VastError = vastErrorClass;

                done();
            });
        });
    });

    it('should be possible to get the code', function () {
        expect(new VastError(101).code).to.equal(101);
    });

    describe('message', function () {
        it('should be parsing error for 100', function () {
            expect(new VastError(100).message).to.contain("XML parsing error.");
        });

        it('should be wrapper error for 300', function () {
            expect(new VastError(300).message).to.contain("General Wrapper error.");
        });

        it('should be unknown error code for 999999', function () {
            expect(new VastError(999999).message).to.contain("Unknown error code");
        });

        it('should be our own error message when supplied to VastError', function () {
            var vastError = new VastError(300, 'My Error Message');
            expect(vastError.message).to.contain("My Error Message");
            expect(vastError.message).to.contain("300");
        });
    });

    describe('working with chai', function () {
        it("should be possible check the type only", function () {
            var deferred = Q.defer(),
                promise = deferred.promise;

            deferred.reject(new VastError(300));

            return expect(promise).to.be.rejectedWith(VastError);
        });

        it("should be possible check the code", function () {
            var deferred = Q.defer(),
                promise = deferred.promise;

            deferred.reject(new VastError(100));

            return expect(promise).to.be.rejectedWith(VastError, "100");
        });
    });

    describe('getErrorURIs', function() {
        it('should return an empty array if no vast tags passed in', function() {
            var vastError = new VastError(300, 'My Error Message');
            expect(vastError.getErrorURIs()).to.deep.equals([]);
        });

        it('should return any error pixels from a wrapper', function() {
            var errorPixel = "http://example.com/error/ERRORCODE";
            var vastTag = {
                wrappers: [
                    {
                        "VAST": {
                            "Ad": {
                                "Wrapper": {
                                    "Error": [{
                                        "nodeValue": errorPixel
                                    }]
                                }
                            }
                        }
                    }
                    ]
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([errorPixel]);
        });

        it('should return any error pixels from the VAST element when on a wrapper', function() {
            var errorPixel = "http://example.com/error/ERRORCODE";
            var vastTag = {
                wrappers: [
                    {
                        "VAST": {
                            "Error": [{
                                "nodeValue": errorPixel
                            }],
                            "Ad": {
                                "Wrapper": {}
                            }
                        }
                    }
                    ]
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([errorPixel]);
        });

        it('should return any error pixel from the inline Ad element', function() {
            var errorPixel = "http://example.com/error/ERRORCODE";
            var vastTag = {
                inline: {
                    "VAST": {
                        "Ad": {
                            "InLine": {
                                "Error": [{
                                    "nodeValue": errorPixel
                                }]
                            }
                        }
                    }
                }
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([errorPixel]);
        });

        it('should return any error pixels from the VAST element when on the inline file', function() {
            var errorPixel = "http://example.com/error/ERRORCODE";
            var vastTag = {
                inline: {
                    "VAST": {
                        "Error": [{
                            "nodeValue": errorPixel
                        }],
                        "Ad": {
                            "InLine": {
                            }
                        }
                    }
                }
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([errorPixel]);
        });

        it('should return any error pixels from both wrappers and the inline', function() {
            var errorPixel1 = "http://example.com/error/ERRORCODE",
                errorPixel2 = "http://example.com/error/ERRORCODE2",
                errorPixel3 = "http://example.com/error/ERRORCODE3";

            var vastTag = {
                wrappers: [
                    {
                        "VAST": {
                            "Ad": {
                                "Wrapper": {
                                    "Error": [{
                                        "nodeValue": errorPixel1
                                    },
                                    {
                                        "nodeValue": errorPixel2
                                    }]
                                }
                            }
                        }
                    }
                ],
                inline: {
                    "VAST": {
                        "Ad": {
                            "InLine": {
                                "Error": [{
                                    "nodeValue": errorPixel3
                                }]
                            }
                        }
                    }
                }
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.contain(errorPixel1);
            expect(vastError.getErrorURIs()).to.contain(errorPixel2);
            expect(vastError.getErrorURIs()).to.contain(errorPixel3);
            expect(vastError.getErrorURIs()).to.have.length(3);
        });

        it('should not include any error pixels that lack nodeValues', function() {
            var vastTag = {
                wrappers: [
                    {
                        "VAST": {
                            "Ad": {
                                "Wrapper": {
                                    "Error": [{}]
                                }
                            }
                        }
                    }
                ]
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([]);

        });

        it('should not include any error pixels when there are no errors', function() {
            var vastTag = {
                wrappers: [
                    {
                        "VAST": {
                            "Ad": {
                                "Wrapper": {}
                            }
                        }
                    }
                ]
            };

            var vastError = new VastError(101, 'Some message about errors', vastTag);

            expect(vastError.getErrorURIs()).to.deep.equal([]);
        });
    });

});
